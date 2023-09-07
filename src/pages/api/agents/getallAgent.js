import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { GetAgentByUserCode } from 'src/databse/agent/getagentinformation';
import { GetAllAgents, GetSubAgentsByEmail } from 'src/databse/subAgents/SubAgents';


export default async function handler(req,res){
    if(req.method === "GET"){
        const {name,type } = req.query;
        const token = await getToken({ req });
        if(token.isAdmin == false){
            res.status(200).json({name:{
              isValid:false,
              errorMsg : "شما اجازه دسترسی به این سرویس را ندارید."
            }});
            return;
        }

        var result = await GetAllAgents();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(result);
        return;
    }
}