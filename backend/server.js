const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const gemini_route = require('./routes/geminiRoute.js')
const elevenlabs_route = require('./routes/elevenlabsRoute.js')
app.use(express.json())
app.use(cors())

app.use('/gemini', gemini_route)
app.use('/elevenlabs', elevenlabs_route)

app.get('/', (req,res) => {
    res.status(200).json({msg: "Hello World"})
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})