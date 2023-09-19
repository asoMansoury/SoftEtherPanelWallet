import { getSession } from "next-auth/react";
import GetPurchasedAccounts from "src/databse/user/getPurchasedAccounts";
import { getToken } from "next-auth/jwt";
import { GetAgentUserTests } from "src/databse/agent/GetAgentUserTests";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
export default async function handler(req,res){
    if(req.method === "GET"){
        const token = await getToken({ req });
        if(token==null){
            return {
                isValid:false,
                error:"دسترسی مجاز نمی باشد."
            }
        }
        var agent = await IsAgentValid(token.email);
        if(agent.isAgent==false){
            return {
                isValid:false,
                error:"دسترسی مجاز نمی باشد."
            }
        }
        var result = await GetAgentUserTests(token);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({result});
    }
}