import { getSession } from "next-auth/react";
import  { GetUserInformationByEmail } from "src/databse/user/getPurchasedAccounts";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {email } = req.query;
        const session = await getSession({ req });
        var userBasket = await GetUserInformationByEmail(session.user.email);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:userBasket});
    }
}