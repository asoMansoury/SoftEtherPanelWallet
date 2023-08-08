import { getCsrfToken, getSession } from 'next-auth/react';
import { IsAgentValid } from 'src/databse/agent/getagentinformation';


export default async function handler(req,res){
    if(req.method === "GET"){
        const {name } = req.query;
        const session = await getSession({ req });
        var Agent = await IsAgentValid(session.user.email);
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:Agent});
    }
}