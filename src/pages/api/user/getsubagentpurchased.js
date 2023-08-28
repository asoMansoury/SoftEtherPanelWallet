import { getSession } from "next-auth/react";
import { GetPurchasedAccountsForAgents } from "src/databse/user/getPurchasedAccounts";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {email } = req.query;
        var userBasket = await GetPurchasedAccountsForAgents(email);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:userBasket});
    }
}