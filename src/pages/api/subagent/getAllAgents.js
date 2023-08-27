import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { GetAgentByUserCode } from 'src/databse/agent/getagentinformation';
import { GetSubAgentsByEmail } from 'src/databse/subAgents/SubAgents';


export default async function handler(req,res){
    if(req.method === "GET"){
        const {name,type } = req.query;
        const token = await getToken({ req });
        if(token.isAgent == false){
            res.status(200).json({name:{
              isValid:false,
              errorMsg : "شما اجازه دسترسی به این سرویس را ندارید."
            }});
            return;
        }

        var result = await GetSubAgentsByEmail(token.email);
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(result);
        return;
    }
}