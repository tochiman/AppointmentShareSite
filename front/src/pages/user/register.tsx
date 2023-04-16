import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Button from '@mui/material/Button'
import {signIn, useSession} from 'next-auth/react'
import Router from 'next/router'
import { TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

export default function Home() {

  //セッション管理
  const {data: session, status: loading} = useSession()

  const [AlertOn, AlertStatus] = React.useState(false)


  //ステップバー関連
  const steps = ['アカウント作成', '確認', '作成完了'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 0;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  //入力フォーム関連
  type FormData = {
    name: string,
    email: string,
    password: string,
    password_confirm: string; 
  };
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>();
  const onSubmit = handleSubmit((data) => {
    if (data.password === data.password_confirm){
      handleNext()        //次のステップへ
      AlertStatus(false)  //パスワードが一致しているため非表示
    } else {
      AlertStatus(true)   //パスワードが不一致のため表示
    }
  });

  
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
        <div className={styles.main}>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: React.ReactNode;
                } = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  <Alert severity="success">登録が完了しました。</Alert>
                  <Typography sx={{ mt:2, mb: 1 }}>アカウントが作成されました。実際にログインしてカレンダーに予定を追加してみましょう！</Typography>
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={() => {window.location.href = '/api/auth/signin'}}>ログインへ</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                  <div className={styles.new_border}>
                    <div>
                        <h1 className={styles.auth_title}>予定共有サイト</h1>
                        <h3 className={styles.sub_title}>新規作成</h3>
                    </div>
                    <br></br>
                    <form onSubmit={onSubmit}>
                        {AlertOn === false ? null: <Alert severity='error'>パスワードが一致していません。再度入力してください。</Alert>}
                        <div><TextField id="outlined-basic" label="名前" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('name',{required:true})} required />{errors.name && <span className={styles.requiredError}>必須です</span>}</div>
                        <div><TextField id="outlined-basic" label="メールアドレス" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('email',{required:true})} required />{errors.email && <span className={styles.requiredError}>必須です</span>}</div>
                        <div><TextField id="outlined-basic" label="パスワード" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('password',{required:true})} required />{errors.password && <span className={styles.requiredError}>必須です</span>}</div>
                        <div><TextField id="outlined-basic" label="パスワード確認" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('password_confirm',{required:true})} required />{errors.password_confirm && <span className={styles.requiredError}>必須です</span>}</div>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                          <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1, width: "50%" }}
                            variant='outlined'
                          >
                            戻る
                          </Button>
                          <Box sx={{ flex: '1 1 auto' }} />
                            <Button type="submit" variant='contained' sx={{ mr: 1, width: "50%" }}>
                              {activeStep === steps.length - 1 ? '作成' : '次へ'}
                            </Button>
                          </Box>
                    </form>
                  </div>
              </React.Fragment>
            )}
          </Box>
        </div>
      </div>
  )
  }
}