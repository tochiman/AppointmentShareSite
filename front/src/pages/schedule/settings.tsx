import Head from 'next/head'
import Button from '@mui/material/Button'
import { signOut, useSession} from 'next-auth/react'
import Header from '../../component/Header'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

export default function Settings() {
    const {data: session, status: loading} = useSession()

    const drawerWidth = 200;

    if (!session){
        return null
    } else {
        // if (loading){
        //     return <div>Loading....</div>
        // }
        return (
            <>
                <Head>
                    <title>予定共有サイト</title>
                    <meta name="description" content="自分の予定を他の人と簡単に共有することができます。" />
                    <link rel="icon" href="favicon.ico" />
                </Head>
                <Header site='settings'/>
   
            </>
        )
    }
}