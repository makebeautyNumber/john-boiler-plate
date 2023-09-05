import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_actions'
import { useNavigate } from 'react-router-dom';


export default function _ (SpecificComponent, option, adminRoute = null) {
    // option
    // null: 아무나 출입가능 / true: 로그인한 유저만 / false: 로그인한 유저는 출입불가
    
    function AuthenticationCheck(props) {
        
        const dispatch = useDispatch()
        const navigate = useNavigate()

        useEffect(() => {
            dispatch(auth()).then((res) => {
                console.log(res)

                // 로그인 하지 않은 상태
                if (!res.payload.isAuth) {  // 클라이언트의 로그인 상태
                    if (option) { // 라우터의 권리옵션
                        navigate('/login')
                    }
                } else { 
                    // 로그인 한 상태
                    if (adminRoute && !res.payload.isAdmin) {  // 관리자가 아닌데 관리자 페이지 접근 
                        navigate('/')
                    } else {
                        if (option === false) {  //로그인 했는데, 다시 로그인 페이지나 등록페이지에 가는경우 
                            navigate('/')
                        }
                    }
                }
            })
        }, [])
        
        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}