import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Button from '@mui/material/Button'
import {signIn, useSession} from 'next-auth/react'

export default function Home() {
  const {data: session, status: loading} = useSession()

  if(session){
      window.location.href = '/schedule/my'
  }else{
    return( 
      <div className={styles.container}>
        <Head>
          <title>予定共有サイト</title>
          <meta name="description" content="自分の予定を他の人と簡単に共有することができます。" />
          <link rel="icon" href="favicon.ico" />
        </Head>
        <div className={styles.Main_index}>
          <div className={styles.auth_border}>
            <h1 className={styles.auth_title}>予定共有サイト</h1>
            <br></br>
            <Button variant="contained" sx={{width:"100%", mb:"10px"}} onClick={() => window.location.href = "/user/register"} >新規作成</Button>            
            <Button className={styles.login_button} variant="contained"  onClick={() => signIn()} sx={{width:"100%"}}>ログイン</Button>
          </div>
        </div>
    </div>
  )
  }
}
