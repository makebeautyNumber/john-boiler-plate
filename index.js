const express = require('express')
const app = express()
const PORT = 5000

const { User } = require('./models/User')
const config = require('./config/key')

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, 
}).then(() => {
    console.log('mongo db 연결 성공')
}).catch((err) => {
    console.error(err)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.post('/register', async (req, res) => {
    const user = new User(req.body)
    await user.save()
    return res.status(200).json({ success: true })
})

app.listen(PORT, () => {
    console.log('Server is listening on port 5000....')
})

