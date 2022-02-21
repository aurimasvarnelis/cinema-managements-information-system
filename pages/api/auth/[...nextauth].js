import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

export default NextAuth({
  session: { 
    strategy: "jwt" 
  },
  adapter: MongoDBAdapter(clientPromise),
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
     /* 
    EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains
     
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        return {  
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user',
        }
      },
    }),  
  ],
  theme: {
    colorScheme: "light",
  },
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for check email message)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
  callbacks: {
    async jwt({ token, user, profile }) {
      const administrator = [ 'aurimas.varnelis@gmail.com' ]
      //token.isAdmin = administrators.includes(user?.email)
        
       //token.userRole = "admin"
        //console.log(user.role)
        if (profile) {
          token.user = user
          //token.user.role = "admin"
        }

        // console.log(token)
        // token.role = user.role
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      // session.userRole = "admin"
      //session.user.role = user.role
      session.user.role = token.user.role;
      return session
    },
  },
})