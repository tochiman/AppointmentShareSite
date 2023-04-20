import NextAuth from 'next-auth'
import CredentialsProviders from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'

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

const FetchUserAPI = async (credentials): Promise<TypeResult> => {
  const url = 'http://api:8080/api/v1/user/info?email=' + credentials.email 
  const result = fetch(url, {method: 'GET', headers:{'Content-Type':'application/json'}})
   .then(res => res.json()) 
  .catch(resp => {
    console.log(resp)
  })
  return result
}

// credentials の情報から、ログイン可能か判定してユーザー情報を返す関数
const findUserByCredentials = credentials  => {
  const result = FetchUserAPI(credentials)
  // if ( credentials.email && credentials.password === process.env.USER_PASSWORD ) {
  //   // ログイン可ならユーザー情報を返却
  //   return { id: 1, name: "taro",  email: credentials.email, image: "https://img.icons8.com/pastel-glyph/64/000000/person-male--v2.png" }
  // } else {
  //   // ログイン不可の場合は null を返却
  //   return null
  // }
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
        const user = findUserByCredentials(credentials)
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
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, account }) {
      if (account) token.accessToken = account.access_token;
      return token
    },
  }
}

export default (req: any, res: any) => NextAuth(req, res, options)