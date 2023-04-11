import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { useSession, signOut, signIn } from "next-auth/react"
import React, { useEffect, useState } from 'react';
import DefaultErrorPage from 'next/error'

export default function Home() {
  const { data: session, status } = useSession();
  const [isShow, setIsShow] = useState(false);

  const ShowPopup = () => {
    setIsShow(!isShow);
  }
  const ClosePopup = () => {
    setIsShow(false);
  }

  const sleep = (waitMsec) => {
    var startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
  }

  const [text, setText] = useState("")

  function Account_popup(props){
    return (
      <div className={styles.popup}>
        <img className={styles.acountPop} src={session.user.image} />
        <p>{session.user.name} <span>でログイン中</span></p>
        <p className={styles.emailPop}>{session.user.email}</p>
        <hr className={styles.line}></hr>
        <a href='/schedule/my'><div>自分の予定</div></a>
        <a href='/schedule/everyone'><div>みんなの予定</div></a>
        <a href=''><div>設定</div></a>
        <div className={styles.logout}>
          <a href='/api/auth/signout'><img src='../logout_FILL0_wght400_GRAD0_opsz48.svg' width='18px' ></img>ログアウト</a>
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <>
        <Head>
          <title>予定共有サイト -設定-</title>
          <meta name="description" content="自分の予定を他の人と簡単に共有することができます。" />
          <link rel="icon" href="../favicon.ico" />
        </Head>
        <body>
          <header>
            <h1>
                <img class={styles.logo} src='../favicon.ico' />
                <a class={styles.title} href="/schedule/my">予定共有サイト</a>
            </h1>
            <nav class={styles.hednav}>
              <ul>
                <li><a href="/schedule/my" >自分の予定</a></li>
                <li><a href="/schedule/everyone">みんなの予定</a></li>
                <li><a href="" className={styles.headselect}>設定</a></li>
                <div onClick={ShowPopup}>
                  <img class={styles.triming} src={session.user.image} />
                </div>
                {isShow && <Account_popup />}  {/*アカウント画像のクリックによってログアウト関連のポップアップを表示非表示を切り替える */}
              </ul>
            </nav>
          </header>
        </body>
        
        <main>
        {/* <img src='https://img.cdn.nimg.jp/s/nicovideo/thumbnails/41087414/41087414.55055510.original/r1280x720l?key=23e0ddd99c9a0f6e5bf7f5a7177f110b1557eec06dfa34ab5247e86a7c7eae37' width={'100%'}></img> */}
        </main>
      </>
    )
  }
  else{
    return (
      null
    ) 
  }
}

