import { Backdrop, CircularProgress, Snackbar, Alert } from '@mui/material'
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react'
import { FC } from 'react';

const LoginSnackBar = () => {
    const {data: session, status: loading} = useSession()

    // const [flag, setFlag] = useState(true)
    // if (session && flag) {
    //     setFlag(false)
    // } else if (!session && !flag) {
    //     setFlag(true)
    // }
    
    // useEffect(() => {
    //     if (!flag) {
    //         console.log('aa');
    //     } else {
    //         console.log('bb');
    //     }
    // },[flag])
    
    const [open, setOpen] = useState(true);
    
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    return (
        <>
            <Snackbar open={open} autoHideDuration={1500} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                {session?.user?.name}でログイン中
                </Alert>
            </Snackbar>
        </>
    )
};

export default LoginSnackBar;