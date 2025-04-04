import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../../utils/constants'

const TeacherRoute = ({children}) => {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);

    if(token !== null && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR)
        return children
    else
        return <Navigate to="/login" />

}

export default TeacherRoute