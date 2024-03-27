import { getToken } from "next-auth/jwt";
import { SaveToCache } from "src/databse/Cache/CacheManager";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
import { GetCustomerByEmail } from "src/databse/customers/getcustomer";
import { CalculateTotalPriceModifed } from "src/databse/tariffagent/calculateTotalPrice";
import { Redis_Set_Data } from "src/redis/redisconnection";

export default async function handler(req,res){
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Allow CORS preflight request
        res.status(200).end();
        
        return;
    }
    if(req.method === "POST"){
        const { data } = req.body;

        const token = await getToken({ req });
        var isAgent =await IsAgentValid(token.email);
        if(isAgent.isAgent==true){
            var result =await CalculateTotalPriceModifed(isAgent.agentcode,data.tariffPlans,data.type);
            data.price=result.ownerPrice;
            data.agentPrice = result.agentPrice;
            data.debitToAgent = result.agentPrice - result.ownerPrice;
            data.isfromagent = false;
        }else{
            var customer = await GetCustomerByEmail(token.email);
            var result =await CalculateTotalPriceModifed(customer.agentIntoducer,data.tariffPlans,data.type);
            data.price=result.agentPrice;
            data.agentPrice = result.agentPrice;
            data.debitToAgent = 0;
            data.ownerprice = result.ownerPrice;
            data.agentIntoducer = customer.agentIntoducer; 
        }
        
        var objJson = JSON.stringify(data);
        await SaveToCache(data.uuid, objJson);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:"OK"});
    }else {
        console.log("method not allow");
      res.status(405).json({ message: 'Method Not Allowed' });
    }
}