import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../_actions/user_actions'

function RegisterPage(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [Email, setEmail] = useState('')
  const [Name, setName] = useState('')
  const [Password, setPassword] = useState('')
  const [CfPassword, setCfPassword] = useState('')
  
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }
  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  const onCfPasswordHandler = (event) => {
    setCfPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault()

    if (Password !== CfPassword) {
      return alert('비밀번호의 확인이 일치하지 않습니다.')
    }

    const body = {
      email: Email, password: Password, name: Name
    }

    dispatch(registerUser(body))
      .then(response => {
        console.log(response.payload)
        if(response.payload.success) {   // 서버 응답보고 데이터 확인후 수정, 모두 일치 시켜야 편함 
          navigate('/login')
        } else {
          alert('Fail to sign up')
        }
      })

  }
  
  
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form style={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type='email' value={Email} onChange={onEmailHandler} />
        <label>Name</label>
        <input type='text' value={Name} onChange={onNameHandler} />
        <label>Password</label>
        <input type='password' value={Password} onChange={onPasswordHandler} />
        <label>Confirm Password</label>
        <input type='password' value={CfPassword} onChange={onCfPasswordHandler} />
        <br></br>
        <button>회원가입</button>
      </form>
    </div>
  )
}

export default RegisterPage