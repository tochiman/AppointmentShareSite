import { Modal } from "@mui/material";
import styles from '@/styles/Home.module.css'
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { FC } from "react";

interface MyComponentProps {
  site: string;
}

const Header: FC<MyComponentProps> = ({ site }) => {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imageURL  = session?.user?.image

  if (site == "my") {
    var myURL = ""
    var everyoneURL = "/schedule/everyone"
    var settingsURL = "/schedule/settings"
    return (
      <>
        <header>
          <h1>
            <img className={styles.logo} src='../favicon.ico' />
            <a className={styles.title} href="/schedule/my">予定共有サイト</a>
          </h1>
          <nav className={styles.hednav}>
            <ul>
              <li><a href={myURL} className={styles.headselect}>自分の予定</a></li>
              <li><a href={everyoneURL}>みんなの予定</a></li>
              <li><a href={settingsURL}>設定</a></li>
              <div onClick={handleOpen}>
                {imageURL && <img className={styles.triming} src={imageURL} />}
              </div>
              <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                <div className={styles.popup}>
                {imageURL && <img className={styles.acountPop} src={imageURL} />}
                <p>{session?.user?.name} <span>でログイン中</span></p>
                <p className={styles.emailPop}>{session?.user?.email}</p>
                <hr className={styles.line}></hr>
                <a href={myURL}><div>自分の予定</div></a>
                <a href={everyoneURL}><div>みんなの予定</div></a>
                <a href={settingsURL}><div>設定</div></a>
                <p className={styles.logout} onClick={() => {
                  const url = process.env.API_FRONT + '/api/v1/token/delete'
                  const Options = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: session?.user.id,
                      token: session?.user.accessToken,
                    }),
                  };
                  const result = fetch(url, Options).catch(res => {console.log(res)})                
                  signOut({callbackUrl: "/"})
                }}><div><img src='../logout_FILL0_wght400_GRAD0_opsz48.svg' width='18px' ></img>ログアウト</div></p>
              </div>    
              </Modal>
            </ul>
          </nav>
        </header>
      </>
    )
  } else if (site == "everyone"){
    var myURL = "/schedule/my"
    var everyoneURL = ""
    var settingsURL = "/schedule/settings"
    return (
      <>
        <header>
          <h1>
            <img className={styles.logo} src='../favicon.ico' />
            <a className={styles.title} href="/schedule/my">予定共有サイト</a>
          </h1>
          <nav className={styles.hednav}>
            <ul>
              <li><a href={myURL}>自分の予定</a></li>
              <li><a href={everyoneURL} className={styles.headselect}>みんなの予定</a></li>
              <li><a href={settingsURL}>設定</a></li>
              <div onClick={handleOpen}>
                {imageURL && <img className={styles.triming} src={imageURL} />}
              </div>
              <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                <div className={styles.popup}>
                {imageURL && <img className={styles.acountPop} src={imageURL} />}
                <p>{session?.user?.name} <span>でログイン中</span></p>
                <p className={styles.emailPop}>{session?.user?.email}</p>
                <hr className={styles.line}></hr>
                <a href={myURL}><div>自分の予定</div></a>
                <a href={everyoneURL}><div>みんなの予定</div></a>
                <a href={settingsURL}><div>設定</div></a>
                <p className={styles.logout} onClick={() => {
                  const url = process.env.API_FRONT + '/api/v1/token/delete'
                  const Options = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: session?.user.id,
                      token: session?.user.accessToken,
                    }),
                  };
                  const result = fetch(url, Options).catch(res => {console.log(res)})                
                  signOut({callbackUrl: "/"})
                }}><div><img src='../logout_FILL0_wght400_GRAD0_opsz48.svg' width='18px' ></img>ログアウト</div></p>
              </div>    
              </Modal>
            </ul>
          </nav>
        </header>
      </>
    )
  } else if (site == "settings") {
    var myURL = "/schedule/my"
    var everyoneURL = "/schedule/everyone"
    var settingsURL = ""
    return (
      <>
        <header>
          <h1>
            <img className={styles.logo} src='../favicon.ico' />
            <a className={styles.title} href="/schedule/my">予定共有サイト</a>
          </h1>
          <nav className={styles.hednav}>
            <ul>
              <li><a href={myURL} >自分の予定</a></li>
              <li><a href={everyoneURL}>みんなの予定</a></li>
              <li><a href={settingsURL} className={styles.headselect}>設定</a></li>
              <div onClick={handleOpen}>
                {imageURL && <img className={styles.triming} src={imageURL} />}
              </div>
              <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                <div className={styles.popup}>
                {imageURL && <img className={styles.acountPop} src={imageURL} />}
                <p>{session?.user?.name} <span>でログイン中</span></p>
                <p className={styles.emailPop}>{session?.user?.email}</p>
                <hr className={styles.line}></hr>
                <a href={myURL}><div>自分の予定</div></a>
                <a href={everyoneURL}><div>みんなの予定</div></a>
                <a href={settingsURL}><div>設定</div></a>
                <p className={styles.logout} onClick={() => {
                  const url = process.env.API_FRONT + '/api/v1/token/delete'
                  const Options = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: session?.user.id,
                      token: session?.user.accessToken,
                    }),
                  };
                  const result = fetch(url, Options).catch(res => {console.log(res)})                
                  signOut({callbackUrl: "/"})
                }}><div><img src='../logout_FILL0_wght400_GRAD0_opsz48.svg' width='18px' ></img>ログアウト</div></p>
              </div>    
              </Modal>
            </ul>
          </nav>
        </header>
      </>
    )
  }
}

export default Header;