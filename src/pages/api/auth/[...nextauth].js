import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { GetWalletUser } from "src/databse/Wallet/getWalletUser";
import GetCustomerByEmailAndPassword from "src/databse/customers/getcustomer";
import Login from "src/databse/user/login";

export const authOptions = {
  
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
            username: { label: "email", type: "text", placeholder: "jsmith" },
            password: { label: "password", type: "password" }
        },
        async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied
            //const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
            var userDoc = await Login(credentials);
            if(!userDoc){
                throw new Error("Something went wrong");
            }
            var UserWallet = await GetWalletUser(credentials.email)
            delete userDoc.password;
            userDoc.cashAmount= UserWallet.cashAmount;
            return userDoc;
        }
        })
    ],
    pages:{
      signIn: "/pages/api/auth"
    },
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks:{
        async session({ session, user, token }) {
            session.user.id = token.id;
            session.user.isCustomer = token.isCustomer; 
            session.user.isAgent = token.isAgent; 
            session.user.agentcode = token.agentcode; 
            session.user.isLoggedIn = true;
            session.user.isAdmin = token.isAdmin;
            session.user.cashAmount = token.cashAmount;
          return session;
        },

        async jwt({ token, user, account, profile, isNewUser }) {

            if(user && user._id){
                token.id = user._id;
                token.isCustomer = user.isCustomer; 
                token.isAgent = user.isAgent; 
                token.agentcode = user.agentcode; 
                token.isLoggedIn = true;
                token.isAdmin = user.isAdmin;
                token.cashAmount = user.cashAmount;
            }
          return token
      },
    },
    session: {
      // Set the session duration to 7 days
      maxAge: 30 * 24 * 60 * 60, // seconds
      rememberMe: true,
    },


    
}

export default NextAuth(authOptions)