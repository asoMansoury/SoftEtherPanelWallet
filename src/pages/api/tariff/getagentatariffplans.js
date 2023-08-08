import { getAgentPlans } from "src/databse/tariffagent/getAgentPlans";




export default async function handler(req,res){
    if(req.method === "GET"){
        const {name } = req.query;
        var agents = await getAgentPlans(name);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:agents});
    }
}