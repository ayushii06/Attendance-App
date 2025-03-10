import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../../utils/constants'

const AdminRoute = ({children}) => {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);

    if(token !== null && user?.accountType === ACCOUNT_TYPE.ADMIN)
        return children
    else
        return <Navigate to="/login" />

}

export default AdminRoute