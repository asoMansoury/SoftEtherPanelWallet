import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { IncreaseAgentWalletByAdmin } from "src/databse/Wallet/IncreaseWallet";
import { IncreaseAgentByAdmin, RefundSubAgent } from "src/databse/agent/RefundSubAgent";
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
        const { money, agentcode, email } = req.body;
        const token = await getToken({ req });
        if (token == null ) {
            res.status(200).json({ name: "شما اجازه دسترسی به این سرویس را ندارید." });
            return;
        }
        if (token.isAdmin == false ) {
            res.status(200).json({ name: "شما اجازه دسترسی به این سرویس را ندارید." });
            return;
        }
        const result = await IncreaseAgentByAdmin(money, agentcode, email, token.isAdmin);

        // Return a response
        res.status(200).json({ result });
    } else {
        console.log("method not allow")
        res.status(405).json({ message: 'Method Not Allowed' });
    }

}





