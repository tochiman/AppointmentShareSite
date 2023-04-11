import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Button from '@mui/material/Button'
import {signIn, useSession} from 'next-auth/react'
import Router from 'next/router'
import { TextField } from '@mui/material'
import { useForm } from 'react-hook-form'

export default function Home() {

  const {data: session, status: loading} = useSession()
  
    type FormData = {
      name: string,
      email: string,
      password: string,
      password_confirm: string; 
    };
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>();
  const onSubmit = handleSubmit(data => console.log(data));

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
        <div className={styles.Main}>
          <div className={styles.new_border}>
            <div>
            <h1　className={styles.register_title}>
                <img className={styles.logo} src='../favicon.ico' />
                <a className={styles.auth_title} href="/schedule/my">予定共有サイト</a>
            </h1>
            <h3 className={styles.sub_title}>新規作成</h3>
            </div>
            <br></br>
            <form onSubmit={onSubmit}>
                <div><TextField id="outlined-basic" label="名前" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('name',{required:true})} required />{errors.name && <span className={styles.requiredError}>必須です</span>}</div>
                <div><TextField id="outlined-basic" label="メールアドレス" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('email',{required:true})} required />{errors.email && <span className={styles.requiredError}>必須です</span>}</div>
                <div><TextField id="outlined-basic" label="パスワード" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('password',{required:true})} required />{errors.password && <span className={styles.requiredError}>必須です</span>}</div>
                <div><TextField id="outlined-basic" label="パスワード確認" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('password_confirm',{required:true})} required />{errors.password_confirm && <span className={styles.requiredError}>必須です</span>}</div>
                <Button type='submit' className={styles.login_button} variant="contained" sx={{width:"100%"}}>次へ</Button>
            </form>
          </div>
        </div>
    </div>
  )
  }
}
