import NextAuth from 'next-auth'
import CredentialsProviders from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'
import jwt from 'jsonwebtoken'
import PersonIcon from '@mui/icons-material/Person';

// credentials の情報から、ログイン可能か判定してユーザー情報を返す関数
const findUserByCredentials = credentials  => {
  if (
    credentials.email === process.env.USER_EMAIL && credentials.password === process.env.USER_PASSWORD
  ) {
    const secret = process.env.JWT_SECRET;
    const token =  jwt.sign(credentials.email, secret); 
    // ログイン可ならユーザー情報を返却
    return { id: 1, name: "taro",  email: credentials.email, image: "https://img.icons8.com/pastel-glyph/64/000000/person-male--v2.png" , jwt: token}
  } else {
    // ログイン不可の場合は null を返却
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
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
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
    async session({ session, token, user, account}) {
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