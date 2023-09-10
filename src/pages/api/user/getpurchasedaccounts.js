import { getSession } from "next-auth/react";
import GetPurchasedAccounts from "src/databse/user/getPurchasedAccounts";
import { getToken } from "next-auth/jwt";
export default async function handler(req,res){
    if(req.method === "GET"){
        const {email } = req.query;
        const session = await getSession({ req });
        const token = await getToken({ req });
        var userBasket = await GetPurchasedAccounts(session.user.email,token);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:userBasket});
    }
}