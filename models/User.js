const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt =  require('jsonwebtoken')

const saltRounds = 10
const TOKEN = 'secretTTTT'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 200 // 길이 늘림, bcrypt 암호화 길이는 보통 60이라고 함 
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})


// 비밀번호 암호화시키기 
userSchema.pre('save', function(next) {
    let user = this

    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

// 선언함수 this 선언 오류 잡음, 비번길이 오류=> 200으로 길이 늘림 
userSchema.methods.comparePassword = function(plainPassword, callFn) {
    let user = this 
    bcrypt.compare(plainPassword, user.password, function(err, isMatch) {
        if(err) return callFn(err)
        callFn(null, isMatch)
    })
}

userSchema.methods.generateToken = async function(callfn) {
    let user = this
    // jsonwebtoken을 이용해서 토큰을 생성
    const token = jwt.sign(user._id.toHexString(), TOKEN)
    try {
        user.token = token
        await user.save()
        callfn(null, user)
    } catch(err) {
        console.error(err)
        callfn(err)
    }
}

userSchema.statics.findByToken = async function(token, callfn) {
    let user = this

    // 토큰을 decode
    const decoded = jwt.verify(token, TOKEN)
    try {
        const userMatched = await user.findOne({ "_id": decoded, "token": token })
        callfn(null, userMatched)  // 콜백 함수 형식 실수해서 에러잡는데 고생 
    } catch(err) {
        return callfn(err)
    }

    // jwt.verify(token, TOKEN, async function(err, decoded) {
    //     // 유저 아이디를 이용해서 유저를 찾은 다음, 클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인
    //     try {
    //         const userChecked = await user.findOne({ "_id": decoded, "token": token })
    //         console.log(userChecked)
    //         callfn(userChecked)
    //     } catch(err) {
    //         return callfn(err)
    //     }
    // })
}

const User = mongoose.model('User', userSchema)
module.exports = { User }