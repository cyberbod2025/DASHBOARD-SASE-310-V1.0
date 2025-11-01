
// FIX: Module '"@google/genai"' has no exported member 'LiveSession'.
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { decode, decodeAudioData, createPcmBlob } from './audioUtils';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Text Generation ---
export const summarizeTextWithGemini = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Resume el siguiente reporte escolar en un párrafo conciso y objetivo:\n\n---\n${text}\n---`,
            config: {
                temperature: 0.2,
                topP: 0.9,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for summarization:", error);
        return "Error al generar el resumen.";
    }
};

// --- Text-to-Speech (TTS) ---
export const generateSpeech = async (textToSpeak: string, audioContext: AudioContext): Promise<AudioBuffer> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: textToSpeak }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // A friendly voice
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data received from API");
    }
    
    // Decode the base64 string into a Uint8Array using the utility function
    const audioBytes = decode(base64Audio);
    
    // Pass the raw audio bytes to be decoded into an AudioBuffer
    return await decodeAudioData(audioBytes, audioContext, 24000, 1);
};


// --- Live Conversation API ---
interface LiveConversationHandlers {
    onMessage: (message: LiveServerMessage) => void;
    onError: (e: ErrorEvent) => void;
    onClose: () => void;
    stream: MediaStream;
}

let inputAudioContext: AudioContext | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let mediaStreamSource: MediaStreamAudioSourceNode | null = null;


// FIX: LiveSession is not an exported member of '@google/genai'. Using ReturnType to infer the promise type from ai.live.connect.
export const setupLiveConversation = async ({ onMessage, onError, onClose, stream }: LiveConversationHandlers): Promise<Awaited<ReturnType<typeof ai.live.connect>>> => {
    inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

    const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: () => {
                console.log('Live session opened');
                mediaStreamSource = inputAudioContext!.createMediaStreamSource(stream);
                scriptProcessor = inputAudioContext!.createScriptProcessor(4096, 1, 1);

                scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    const pcmBlob = createPcmBlob(inputData);
                    sessionPromise.then((session) => {
                         session.sendRealtimeInput({ media: pcmBlob });
                    });
                };
                
                mediaStreamSource.connect(scriptProcessor);
                scriptProcessor.connect(inputAudioContext.destination);
            },
            onmessage: onMessage,
            onerror: onError,
            onclose: onClose,
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: 'Eres un asistente amigable y profesional para personal escolar. Ayuda a registrar reportes, obtener resúmenes de alumnos y responder preguntas sobre procedimientos escolares. Habla en español.',
        },
    });

    return sessionPromise;
};

// FIX: LiveSession is not an exported member of '@google/genai'. Using ReturnType to infer the promise type from ai.live.connect.
export const closeLiveConversation = (sessionPromise: Promise<Awaited<ReturnType<typeof ai.live.connect>>>) => {
    sessionPromise.then(session => session.close());
    
    if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor = null;
    }
    if (mediaStreamSource) {
        mediaStreamSource.disconnect();
        mediaStreamSource = null;
    }
    if (inputAudioContext) {
        inputAudioContext.close();
        inputAudioContext = null;
    }
    console.log("Live conversation resources cleaned up.");
};