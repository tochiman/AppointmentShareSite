import Head from 'next/head'
import { useSession} from 'next-auth/react'
import Header from '../../component/Header'
import LoginSnackBar from '@/component/loginSnack'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import styles from '@/styles/Home.module.css'

export default function My() {
    const {data: session, status: loading} = useSession()  

    if (!session){
        return null
    } else {
        // if (loading){
        //     return (
        //         <>
        //             <CircularProgress color="inherit" />
        //         </>
        //     )
        // }
        return (
            <>
                <Head>
                    <title>予定共有サイト</title>
                    <meta name="description" content="自分の予定を他の人と簡単に共有することができます。" />
                    <link rel="icon" href="../favicon.ico" />
                </Head>
                <Header site="my" />
                <LoginSnackBar />
                <main>
                    <div id="modal"></div>
                    <div className={styles.FullCalendar}>
                        <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                        initialView={'dayGridMonth'}      // Specifying the first visible calendar notation
                        locale={"ja"}                     // Setting Language...

                        // Setting the size of the calendar
                        height={'100%'}
                        scrollTime={'00:00'}

                        navLinks={true}                   //  it becomes a date notation if press a number
                        nowIndicator={true}               //　Show current time bar
                        editable={false}                  // To invalid　Edit-mode
                        dayMaxEvents={true}

                        // divide 1 hour into 4 parts
                        slotDuration={'00:15:00'}
                        slotLabelInterval={'01:00'}

                        // Change the characters displayed in the calendar
                        buttonText={{
                            today: "今日",
                            month: '月',
                            week: '週',
                            day: '日',
                            list: 'リスト'
                        }}

                        // change the look of the title
                        views={{
                            timeGridWeek: {
                            titleFormat: function (date) {
                                const startMonth = date.start.month + 1;
                                const endMonth = date.end.month + 1;
                        
                                // 1週間のうちに月をまたぐかどうかの分岐処理
                                if (startMonth === endMonth) {
                                return startMonth + '月';
                                } else {
                                return startMonth + '月～' + endMonth + '月'; 
                                }
                            },
                            dayHeaderFormat: function (date) {
                                const day = date.date.day;
                                const weekNum = date.date.marker.getDay();
                                const week = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'][weekNum];
                        
                                return day + ' ' + week;
                            }
                            }
                        }}

                        customButtons={{
                            NewCalendarButton: {
                            text: '新規作成',
                            click: function() {
                                // カレンダー新規作成画面へ遷移
                                window.location.href = '/create/calendar';
                            },
                            },
                        }}
                        
                        headerToolbar={{
                            start: 'today',
                            center: 'title',
                            end: 'NewCalendarButton',
                        }}
                        footerToolbar={{
                            start: 'prevYear,prev,next,nextYear', 
                            center: '',
                            end: 'dayGridMonth,timeGridWeek,timeGridDay', 
                        }}
                        />
                    </div>         
                </main>
            </>
        )
    } 
}