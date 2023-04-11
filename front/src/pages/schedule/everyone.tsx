import Head from 'next/head'
import Button from '@mui/material/Button'
import { signOut, useSession} from 'next-auth/react'
import Header from '../../component/Header'

export default function Everyone() {
    const {data: session, status: loading} = useSession()

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
                <Header site='everyone'/>
            </>
        )
    }
}