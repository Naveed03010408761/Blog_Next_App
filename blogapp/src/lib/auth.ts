import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./mongodb";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: { 
    strategy: "jwt",
    maxAge: 60 * 60 * 2
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // ✅ Return full user data including avatar and bio
        return { 
          id: user._id.toString(), 
          email: user.email, 
          role: user.role, 
          name: user.name ?? "User",
          avatar: user.avatar,  // Add avatar
          bio: user.bio         // Add bio
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.avatar = user.avatar;  // Add avatar to token
        token.bio = user.bio;        // Add bio to token
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
        avatar: token.avatar as string,  // Add avatar to session
        bio: token.bio as string,        // Add bio to session
      };
      return session;
    }
  }
});