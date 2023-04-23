import NextAuth, { DefaultSession, Session } from 'next-auth'
import CredentialsProviders from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from "next-auth/jwt"
import { Account } from 'next-auth'
import { User } from 'next-auth'

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string,
      accessToken: string,
    } & DefaultSession["user"]
  }
  interface User {
    token:string & DefaultSession["user"]
  }
  interface Account {
    access_token: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string,
    accessToken: string,

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

type ModelToken = {
  status: string,
  content: {
    token: string
  }
}

// credentials の情報から、ログイン可能か判定してユーザー情報を返す関数
const FetchUserAPI = async (credentials) => {
  const url = process.env.API_BACK + '/api/v1/user/info?email=' + credentials.email 
  const result = await fetch(url, {method: 'GET', headers:{'Content-Type':'application/json'}})
  const ResultJson: TypeResult = await result.json()
  const res = ResultJson.result[0]
  if (ResultJson.status == 'ok') {
    if ( credentials.email == res.email && credentials.password == res.password ) {
      // ログイン可ならユーザー情報を返却
      const url = process.env.API_BACK + '/api/v1/token/create'
      const Options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: res.id,
        }),
      };
    
      const result = await fetch(url, Options)
      const ResultJson: ModelToken = await result.json()
      if (ResultJson.status === '200 OK'){
        if ( res.image == '') res.image = process.env.NEXTAUTH_URL + "/person.png" //画像が指定されていない場合はこちら側でデフォルト画像を提供する
        return {id: res.id, name: res.username,  email: res.email, image: res.image, token: ResultJson.content.token}
      } else {
        return null
      }
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
    async session({ session, token }: {session: Session, token: JWT}) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, account, user }: {token: JWT, account: Account, user: User}) {
      if (account) token.accessToken = account.access_token;
      if (user) {
        token.id = user.id
        token.accessToken = user.token
      }
      return token
    },
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt:{
    maxAge: 24 * 60 * 60, // 24 hours
  },
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"'
    logo: process.env.NEXTAUTH_URL + "/favicon.ico",
  }
}

export default (req: any, res: any) => NextAuth(req, res, options)