import Head from 'next/head'
import {
    Button,
    TextField,
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Alert,
    IconButton,
    OutlinedInput,
    InputLabel,
    Table,
    InputAdornment,
    FormControl,
    TableBody, 
    TableCell, 
    TableContainer, 
    TableRow,
    Paper,
  } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { signOut, useSession} from 'next-auth/react'
import { useState, ReactNode, Fragment } from 'react'
import { useForm } from 'react-hook-form'
import Header from '../../component/Header'
import styles from '@/styles/Home.module.css'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
  
export default function Calendar() {
    const {data: session, status: loading} = useSession()
    //コンポーネントの状態管理
    const [AlertOn, AlertStatus] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [formValue, setFormValue] = useState({
        name : "",
        image : "", 
        email : "",
        password : "",
        password_confirm : "",
    });
    const [Alert400, setAlert400] = useState(false);
    const [Alert500, setAlert500] = useState(false);
    const [Alert201, setAlert201] = useState(false);
    
    //パスワードの表示・非表示
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPasswordConfirm = () => setShowPasswordConfirm((show) => !show);


    //ステップバー関連
    const steps = ['入力', '確認', '結果'];
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    //入力フォーム関連
    type FormData = {
        name: string,
        image: string,
        email: string,
        password: string,
        password_confirm: string; 
    };
    const schema = yup.object().shape({
    password: yup
        .string()
        .required('入力必須')
        .min(8, 'パスワードは8文字以上である必要があります')
        .matches(/^[a-zA-Z0-9_-]+$/, 'パスワードはアルファベット、数字、ハイフン、アンダースコアしか使えません'),
    });
    const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>({
        // バリデーションルールの定義
        criteriaMode: 'all',
        defaultValues: {
        password: '',
        },
        resolver: yupResolver(schema),
    });
    const onSubmit = handleSubmit((data: FormData) => {
        if (data.password === data.password_confirm){
            handleNext()        //次のステップへ
            setFormValue(data)
            AlertStatus(false)  //パスワードが一致しているため非表示
        } else if (data.password !== data.password_confirm) {
            AlertStatus(true)   //パスワードが不一致のため表示
        }
    });
    const RegisterSubmit = handleSubmit((data: FormData) => {
        handleNext();handleNext()        //次のステップへ
        let token: string = session?.user.accessToken ?? ""
        const url = process.env.API_FRONT + '/api/v1/user/update'
        const Options = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'token': token},
            body: JSON.stringify({
                id: session?.user.id,
                username: data.name,
                password: data.password,
                email: data.email,
                image: data.image,
            }),
        }
        console.log(session?.user.accessToken)
        console.log(data)
        
        fetch(url, Options).then((response) => {
            if (response.status === 400) setAlert400(true);
            else if (response.status === 500) setAlert500(true);
            else if (response.status === 201) setAlert201(true);
        }).catch(err => console.log(err))
    });
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
                    <link rel="icon" href="../favicon.ico" />
                </Head>
                <Header site='my'/>
                <div className={styles.container}>
                <div className={styles.main}>
                    <Box sx={{ width: '100%', mt:'100px' }}>
                        <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                            optional?: ReactNode;
                            } = {};
                            return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                            );
                        })}
                        </Stepper>
                        {activeStep === steps.length ? (
                        <Fragment>
                            <div className={styles.new_border}>
                            <div>
                                    <h1 className={styles.sub_title}>カレンダー新規作成</h1>
                            </div>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                <Alert severity="success">再設定が完了しました。</Alert>
                                <Typography sx={{ mt:2, mb: 1 }}>アカウントが再設定されました。もう一度ログインし直してください。</Typography>
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button variant='contained' onClick={() => {
                                                    const url = process.env.API_FRONT + '/api/v1/token/delete'
                                                     const Options = {
                                                        method: 'DELETE',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                        id: session?.user.id,
                                                        token: session?.user.accessToken,
                                                        }),
                                                    };
                                                    const result = fetch(url, Options).then(res => {console.log(res)}).catch(res => {console.log(res)})
                                                    signOut({callbackUrl:'/'})
                                }}>メインへ</Button>
                            </Box>
                            </div>
                        </Fragment>
                        ) : (
                        <Fragment>
                            <div className={styles.new_border}>
                                <div>
                                    <h1 className={styles.sub_title}>カレンダー新規作成</h1>
                                </div>
                                {activeStep === 0 ? (
                                <form onSubmit={onSubmit}>
                                    {Alert400 && <Alert severity="error" sx={{ width: '100%' }}>リクエストエラー</Alert>}
                                    {Alert500 && <Alert severity="error" sx={{ width: '100%' }}>サーバーエラー</Alert>}
                                    {Alert201 && <Alert severity="success" sx={{ width: '100%' }}>再登録が完了しました。</Alert>}
                                    {Alert400 && <Typography sx={{ mt:2, mb: 1 }}>登録できない文字が含まれている。もしくは、すでに登録済みのメールアドレスを使用している可能性があります。もう一度登録し直してください。</Typography>}
                                    {Alert500 && <Typography sx={{ mt:2, mb: 1 }}>使用できない文字が含まれている可能性があります。再度登録しなおしてください。</Typography>}
                                    {Alert201 && <Typography sx={{ mt:2, mb: 1 }}>アカウントが作成されました。実際にログインしてカレンダーに予定を追加してみましょう！</Typography>}
                                    {errors.password && <Alert severity='error' sx={{mb:"10px"}} >{errors.password.message}</Alert>}
                                    {AlertOn === false ? null: <Alert severity='error'>パスワードが一致していません。再度入力してください。</Alert>}
                                    <TextField id="outlined-basic" label="名前" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('name',{required:true})} required />
                                    <FormControlLabel labelPlacement="start" control={<Switch />} label="終日" sx={{textAlign:'left', width:'100%'}} />
                                    <div>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="開始日" slotProps={{textField:{helperText:"MM/DD/YYYY"}}}  sx={{width:'48%', mr:'2%', mt:'10px', mb:'10px'}}/>
                                        <MobileTimePicker label="開始時刻" slotProps={{textField:{helperText:"hh/mm/aa"}}} sx={{width:"48%", ml:'2%', mt: '10px', mb: '10px'}} />
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="終了日" slotProps={{textField:{helperText:"MM/DD/YYYY"}}}  sx={{width:'48%',mr:'2%', mt:'10px', mb:'10px'}}/>
                                        <MobileTimePicker label="終了時刻" slotProps={{textField:{helperText:"hh/mm/aa"}}} sx={{width:"48%", ml:'2%', mt: '10px', mb: '10px'}} />
                                    </LocalizationProvider>
                                    </div>
                                    <TextField id="outlined-basic" label="場所" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('location',{required:true})}/>
                                    <TextField id="outlined-multiline-static" multiline rows={2} label="説明" helperText="" variant="outlined" margin='normal' sx={{ width:"100%", mb: "20px" }} {...register('description',{required:true})} required />
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    {activeStep === 0 ? 
                                    <Button color="inherit" onClick={() => {window.location.href = '/schedule/my'}} sx={{ mr: 1, width: "50%" }} variant='outlined' >戻る</Button>
                                    :
                                    <Button color="inherit" onClick={handleBack} sx={{ mr: 1, width: "50%" }} variant='outlined' >戻る</Button>
                                    }
                                    <Box sx={{ flex: '1 1 auto' }} />
                                        <Button type="submit" variant='contained' sx={{ mr: 1, width: "50%" }}>
                                        {activeStep === steps.length - 1 ? '作成' : '次へ'}
                                        </Button>
                                    </Box>
                                </form>
                                ):null}
                                {activeStep === 1 ? (
                                <form onSubmit={RegisterSubmit}> 
                                    <Typography variant="h6" sx={{textAlign:"center"}} gutterBottom>
                                    以下の情報でアカウントを再設定しますか？
                                    </Typography>
                                    <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                        <TableRow>
                                            <TableCell>名前</TableCell>
                                            <TableCell>{formValue.name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>メールアドレス</TableCell>
                                            <TableCell>{formValue.email}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>アカウント画像</TableCell>
                                            <TableCell>{formValue.image == "" ? "指定なし":formValue.image}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>パスワード</TableCell>
                                            <TableCell>********</TableCell>
                                        </TableRow>
                                        </TableBody>
                                    </Table>
                                    </TableContainer>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    {activeStep === 0 ? 
                                    <Button color="inherit" onClick={() => {window.location.href = '/schdule/my'}} sx={{ mr: 1, width: "50%" }} variant='outlined' >戻る</Button>
                                    :
                                    <Button color="inherit" onClick={handleBack} sx={{ mr: 1, width: "50%" }} variant='outlined' >戻る</Button>
                                    }
                                    <Box sx={{ flex: '1 1 auto' }} />
                                        <Button type="submit" variant='contained' sx={{ mr: 1, width: "50%" }}>
                                        {activeStep === steps.length - 1 ? '作成' : '次へ'}
                                        </Button>
                                    </Box>
                                </form>
                                ): null}
                            </div>
                        </Fragment>
                        )}
                    </Box>
                </div>
            </div>
            </>
        )
    }
}