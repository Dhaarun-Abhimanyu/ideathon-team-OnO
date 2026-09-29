const { ElevenLabsClient } = require('elevenlabs')
require('dotenv').config()

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});


const generateGeminiAudio = async (generated_text, voiceId) => {
    try {
        const audioStream = await elevenlabs.textToSpeech.convertAsStream(voiceId, {
            text: generated_text,
            model_id: process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2",
            output_format: "mp3_44100_128"
        });

        const chunks = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }

        const audioBuffer = Buffer.concat(chunks);
        const audioBase64 = audioBuffer.toString('base64');
        return audioBase64;
    } catch (error) {
        console.error('Error generating audio:', error.message);
        throw error;
    }
};


module.exports = {
    generateGeminiAudio,
}