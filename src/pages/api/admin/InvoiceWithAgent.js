import { getSession } from "next-auth/react";
import InvoiceWithAgent from "src/databse/admin/InvoiceWithAgent";
import { GetAgentBills } from "src/databse/agent/getAgentBill";



export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        
        return;
      }
    if (req.method === 'GET') {
      const { amountInvoice,agentCode } = req.query;
      const session = await getSession({ req });
      if(session.user.isAdmin==true){
        var result = await InvoiceWithAgent(agentCode,amountInvoice);
        res.status(200).json({ name: result});
      }
   }else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
    
  }





