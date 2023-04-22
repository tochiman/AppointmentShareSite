import NextAuth, { DefaultSession } from 'next-auth'
import CredentialsProviders from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string,
      token: string,
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    user: {
      id?: string,
      token?: string,
    } & DefaultSession["user"]
  } 
}

type TypeResult = {
  result: [{
    id: string;
    username: string,
    password: string,
    email: string,
    image: string,
  }],
  status: string,
};

// credentials の情報から、ログイン可能か判定してユーザー情報を返す関数
const FetchUserAPI = async (credentials) => {
  const url = process.env.API_URI + '/api/v1/user/info?email=' + credentials.email 
  const result = await fetch(url, {method: 'GET', headers:{'Content-Type':'application/json'}})
  const ResultJson: TypeResult = await result.json()
  const res = ResultJson.result[0]
  if (ResultJson.status == 'ok') {
    if ( credentials.email == res.email && credentials.password == res.password ) {
      // ログイン可ならユーザー情報を返却
      if ( res.image == '') res.image = process.env.NEXTAUTH_URL + "/person.png" //画像が指定されていない場合はこちら側でデフォルト画像を提供する
      return {id: res.id, name: res.username,  email: res.email, image: res.image }
    } else {
      // ログイン不可の場合は null を返却
      return null
    }
  } else if ( ResultJson.status == 'none') {
      return null
  }
}

const options = {
  providers: [
    CredentialsProviders ({
      name: "Email",
      // credentials は、ログインページで適切なフォームを生成するために使用されます。
      // 送信するフィールドを指定できます。（今回は メールアドレス と パスワード）
      credentials: {
        email: { label: "メールアドレス", type: "email", placeholder: "email@example.com" },
        password: { label: "パスワード", type: "password" },
      },
      // 認証の関数
      async authorize(credentials) {
        const user = FetchUserAPI(credentials)
        if (user) {
          // 返されたオブジェクトはすべてJWTの`user`プロパティに保存される
          return Promise.resolve(user)
        } else {
          // nullまたはfalseを返すと、認証を拒否する
          return Promise.resolve(null)
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    // async signIn(){
    //   //ログイン後にTOKENを発行する
    // },
    // async signOut(){
    //   //ログアウト後にTOKENを破棄する処理
    // },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) token.accessToken = account.access_token;
      if (user) {
        token.id = user.id
        token.accessToken = user.token
      }
      return token
    },
  },
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"'
    logo: process.env.NEXTAUTH_URL + "/favicon.ico",
  }
}

export default (req: any, res: any) => NextAuth(req, res, options)