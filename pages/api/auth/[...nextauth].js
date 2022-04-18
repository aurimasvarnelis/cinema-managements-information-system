import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
	session: {
		strategy: "jwt",
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

		// CredentialsProvider({
		//   name: "credentials",
		//   credentials: {
		//     username: {label: "Email", type:"email", placeholder:"johndoe@test.com"},
		//     password: {label: "Password", type:"password"},
		//   },
		//   authorize: (credentials) => {
		//     if(credentials.username === "john" && credentials.password ==="test"){
		//       return {
		//         id:2,
		//         name: "John",
		//         email: "johndoe@test.com",
		//       };
		//     }
		//   }
		// }),
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
					image: null,
					role: "user",
				};
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
			const administrator = ["aurimas.varnelis@gmail.com"];
			//token.isAdmin = administrators.includes(user?.email)

			if (profile) {
				token.user = user;
			}
			if (user) {
				token.uid = user.id;
			}
			// console.log("JWT");
			// console.log(token);
			return token;
		},
		async session({ session, token, user }) {
			// Send properties to the client, like an access_token from a provider.

			if (session?.user) {
				session.user.role = token.user.role;
				session.user.id = token.uid;
			}
			//session.userId = token.sub;
			// console.log("session");
			// console.log(session);
			return session;
		},
	},
	events: {
		async signIn(message) {
			console.log(message);
		},
	},
});
