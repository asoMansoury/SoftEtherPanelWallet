import { getSession } from "next-auth/react";
import { GetAgentBills } from "src/databse/agent/getAgentBill";



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
      const session = await getSession({ req });
      console.log("session : ",{session});
      var result = await GetAgentBills(body.email);

      // Return a response
      res.status(200).json({ name: result});
   }else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
    
  }





