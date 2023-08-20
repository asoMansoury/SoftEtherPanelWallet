import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { GetAgentBills } from "src/databse/agent/getAgentBill";
import { registerAgentPrice } from "src/databse/tariffagent/registerAgentPrice";



export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {

        // Allow CORS preflight request
        res.status(200).end();
        
        return;
      }
    if (req.method === 'POST') {

      // Handle the POST request here
      const { plans } = req.body;
      const token = await getToken({ req });
      if(token.isAgent ==false){
          res.status(200).json({name:"شما اجازه دسترسی به این سرویس را ندارید."});
          return;
      }

      var result = await registerAgentPrice(token.agentcode,plans);

      // Return a response
      res.status(200).json({ name: []});
   }else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
    
  }





