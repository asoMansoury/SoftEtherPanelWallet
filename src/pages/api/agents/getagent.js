import { getSession } from 'next-auth/react';
import { GetAgentByUserCode } from 'src/databse/agent/getagentinformation';


export default async function handler(req,res){
    if(req.method === "GET"){
        const {name,type } = req.query;
        const session = await getSession({ req });
        var Agent = await GetAgentByUserCode(name,type);
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:Agent});
    }
}