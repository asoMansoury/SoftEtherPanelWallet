import { GenerateNewAccountTest } from "src/databse/testaccounts/GenerateNewAccountTest";



export default async function handler(req,res){
    if(req.method === "GET"){
        const {email,type,servercode,agentcode } = req.query;
        const currentDomain =  req.headers.host;
        var tariffs = await GenerateNewAccountTest(email,type,currentDomain,servercode,agentcode);


        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:tariffs});
    }
}