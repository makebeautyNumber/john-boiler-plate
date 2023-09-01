const express = require('express')
const app = express()
const PORT = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://onlystudy39:WlrwTDxoOI3I8PII@cluster0.xsjwgti.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, 
}).then(() => {
    console.log('mongo db 연결 성공')
}).catch((err) => {
    console.error(err)
})

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.listen(PORT, () => {
    console.log('Server is listening on port 5000....')
})

