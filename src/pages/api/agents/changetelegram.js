import { getToken } from "next-auth/jwt";
import ChangeAgentTelegram from "src/databse/agent/ChangeAgentTelegram";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {telegram } = req.query;
        const token = await getToken({ req });
        if(token.isAgent ==false){
            res.status(200).json({name:"شما اجازه دسترسی به این سرویس را ندارید."});
            return;
        }
        var userBasket = await ChangeAgentTelegram(telegram,token.agentcode);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:userBasket});
    }
}