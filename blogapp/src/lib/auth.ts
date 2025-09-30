import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./mongodb";  
import User from "@/models/User";  

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        // 1. Validate input
        if (!credentials?.email || !credentials.password) return null;

        // 2. Connect to DB
        await dbConnect();

        // 3. Check if user exists
        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) return null;

        // 4. Compare password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // 5. Return user object (without password)
        return { id: user._id.toString(), email: user.email, role: user.role };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          // id: token.id as string,
          email: token.email as string,
          // role: token.role as string,
        };
      }
      return session;
    }
  }
});