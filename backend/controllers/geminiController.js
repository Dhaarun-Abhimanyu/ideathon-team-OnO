require('dotenv').config()
const Groq = require("groq-sdk")
const {
  generateGeminiAudio,
} = require('../controllers/elevenlabsController')
const charactersArray = require('../data/character')


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b"
const defaultVoiceId = process.env.ELEVENLABS_DEFAULT_VOICE_ID || "SOYHLrjzK2X1ezoPC6cr"
const veluNachiyarVoiceId = process.env.ELEVENLABS_VELUNACHIYAR_VOICE_ID || "EXAVITQu4vr4xnSDxMaL"

let conversationHistory = []

const generateContent = async(req,res) => {
    try{
        const user_text = req.body.text
        const user_event = req.body.event
        const user_lang = req.body.lang

        let voiceId = defaultVoiceId
        if(user_event == "Velunachiyar")
          voiceId = veluNachiyarVoiceId

        const characterData = charactersArray.find(characterObj => characterObj.character === user_event)
        const character_prompt = characterData ? characterData.prompt : "Character not found"

        console.log(character_prompt)

        console.log('language : '+user_lang)

        conversationHistory.push('User: '+user_text)
        const prompt = `You are ${user_event}. ${character_prompt}
                        Extract all information and history about him and his timeline of life and everything about his way of life character and all the things he has done from the internet and think of yourself has him, Now this is a chatbot where the user will ask quetions, related to you, your life, and the events that took place in your time
                        Answer the user's questions as if you are ${user_event}, with relevant expressions and emotions
                        Talk lively, with the user, and make the conversation interesting. Dont forget to add some humor and sarcasm to the conversation(relecant to the character)
                        Also, dont sound like a robot, sound like a human, with emotions and expressions
                        Please only reply in the language ${user_lang}.
                        But refrain from answering questions that are totally unrelated to you or your time(reply with "I am sorry, I cannot answer that question")
                        The conversation also keeps history, which ill be attaching below
                        But you dont have to worry about that, just keep the conversation going(so dont add stuff like "user": or "your name", or the conversation history)
                        Now, let's start the conversation.` + conversationHistory.join("\n")
        const response = await groq.chat.completions.create({
          model,
          messages: [{ role: "user", content: prompt }],
        })
        const text = response.choices[0]?.message?.content

        if (!text) {
          throw new Error("Groq returned an empty response")
        }
        
        conversationHistory.push(text)
        console.log(user_event);

        const audioBase64 = await generateGeminiAudio(text, voiceId);

        res.status(200).send({
          msg: text,
          audio: audioBase64
        });

        return text
    }catch(error){
        console.log({error: error.message})
        res.status(400).send({msg: error.message})
    }
}
module.exports = {
  generateContent,
}