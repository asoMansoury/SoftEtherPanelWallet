
import { getSession } from "next-auth/react";
import { CalculateTotalPrice } from "src/databse/tariffagent/calculateTotalPrice";
import { getToken } from "next-auth/jwt"
import { IsAgentValid } from "src/databse/agent/getagentinformation";


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
      const { body } = req.body;
      const token = await getToken({ req });
      if(token ==null ){
          res.status(200).json({ name: {
            isValid:false,
            message:"شماره دسترسی به خرید اکانت ندارید."
          } });
          return;
      }
      var isAgent =await IsAgentValid(token.email);
      if(isAgent.isAgent==false){
        res.status(200).json({ name: {
          isValid:false,
          message:"شماره دسترسی به خرید اکانت ندارید."
        } });
        return;
      }

      var result =await CalculateTotalPrice(body.agentInformation,body.tariffPlans,body.type);
              // Process the data or perform any necessary operations
      res.status(200).json({ name: result });
 

    } else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }



