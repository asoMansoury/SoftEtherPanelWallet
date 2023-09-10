import { getSession } from "next-auth/react";
import { GetPurchasedAccountsForAgents } from "src/databse/user/getPurchasedAccounts";
import { getToken } from "next-auth/jwt";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {email } = req.query;
        const token = await getToken({ req });
        var userBasket = await GetPurchasedAccountsForAgents(email,token);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:userBasket});
    }
}