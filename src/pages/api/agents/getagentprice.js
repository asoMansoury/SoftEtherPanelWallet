import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { GetAgentByUserCode } from 'src/databse/agent/getagentinformation';
import { getAgentTariff } from 'src/databse/tariffagent/getAgentTariff';


export default async function handler(req,res){
    if(req.method === "GET"){
        const token = await getToken({ req });
        if(token.isAgent ==false){
            res.status(200).json({name:"شما اجازه دسترسی به این سرویس را ندارید."});
            return;
        }
        var result = await getAgentTariff(token.agentcode);
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:result});
    }
}