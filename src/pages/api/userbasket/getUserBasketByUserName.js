import { getAgentPlans } from "src/databse/tariffagent/getAgentPlans";
import  { GetUsersBasketByUsername } from "src/databse/usersbasket/getusersbasket";




export default async function handler(req,res){
    if(req.method === "GET"){
        const {username } = req.query;
        var userBasket = await GetUsersBasketByUsername(username);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:userBasket});
    }
}