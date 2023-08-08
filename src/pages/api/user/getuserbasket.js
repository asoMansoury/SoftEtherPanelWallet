import { getAgentPlans } from "src/databse/tariffagent/getAgentPlans";
import GetUsersBasketByUUID from "src/databse/usersbasket/getusersbasket";




export default async function handler(req,res){
    if(req.method === "GET"){
        const {uuid } = req.query;
        var userBasket = await GetUsersBasketByUUID(uuid);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:userBasket});
    }
}