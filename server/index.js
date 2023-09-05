const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const { User } = require('./models/User')
const { auth } = require('./middleware/auth')
const config = require('./config/key')

const PORT = 5000

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, 
}).then(() => {
    console.log('mongo db 연결 성공')
}).catch((err) => {
    console.error(err)
})


app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.get('/api/hello', (req, res) => {
    res.send('hello~~~~ ')
})

app.post('/api/users/register', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        return res.status(200).json({ success: true, message: '유저 등록이 성공하였습니다.' })
    } catch(err) {
        console.error(err)
        res.json({ success: false, err})
    }
})

app.post('/api/users/login', async (req, res) => {
    try {
        // 요청된 이메일을 데이터베이스에서 찾기 
        const user = await User.findOne({ email: req.body.email })
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: '일치하는 이메일이 없습니다'
            })
        }

        // 이메일이 있다면 비밀번호랑 일치하는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(err) { console.log(err) }
            if(!isMatch) {
                return res.json({ loginSuccess: false, message: 'it is wrong password' })
            }
            // 비밀번호가 일치하다면 토큰 생성 
            user.generateToken((err, user) => {
                if(err) {
                    res.status(400).send(err)
                }
                // 토큰을 저장한다. 어디에? [쿠키, 로컬스토리지, ... ]
                res.cookie('x_auth', user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    } catch(err) {
        console.error(err)
    }
})

app.get('/api/users/auth', auth, (req, res) => {  // auth 미들웨어 
    // 미들웨어 통과 했다는거는 auth => true
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true, 
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, async (req, res) => {
    try {
        const userWillDeleted = await User.findOneAndUpdate({ _id: req.user.id }, { token: "" })
        return res.status(200).json({
            logoutSuccess: true
        })
    } catch(err) {
        return res.json({ success: false, err })
    }
})


app.listen(PORT, () => {
    console.log('Server is listening on port 5000....')
})

