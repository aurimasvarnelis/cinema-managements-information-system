import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import User from "../../../models/User";
import clientPromise from "../../../lib/mongodb";
import { compare } from "bcryptjs";
import { createUser } from "../../../controllers/userController";
import dbConnect from "./../../../lib/dbConnect";

dbConnect();

export default NextAuth({
	session: {
		strategy: "jwt",
	},
	adapter: MongoDBAdapter(clientPromise),
	providers: [
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
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email Address", type: "text", placeholder: "Email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				const user = await User.findOne({
					email: credentials.email,
				});

				if (!user) {
					const createdUser = createUser(req);
					return createdUser;
				}

				const checkPassword = await compare(credentials.password, user.password);

				if (!checkPassword) {
					throw new Error("Password doesn't match");
				}

				return user;
			},
		}),
	],
	theme: {
		colorScheme: "light",
	},

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.user = {
					id: user.id,
					email: user.email,
					role: user.role,
				};
			}
			return token;
		},
		async session({ session, token }) {
			session.user = token.user;
			return session;
		},
	},
});
