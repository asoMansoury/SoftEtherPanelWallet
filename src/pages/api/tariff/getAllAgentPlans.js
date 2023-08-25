import { getToken } from "next-auth/jwt";
import { getAllAgentPlans } from "src/databse/tariffagent/getAgentPlans";
import { getAllTariffPrices } from "src/databse/tarrifplans/getTarrifPlans";



export default async function handler(req, res) {
    if (req.method === "GET") {
        const { type } = req.query;
        var token = await getToken({ req });
        if (token == null)
            return;
        if (token.isAgent == false) {
            res.status(200).json({ isValid:false,errorMsg: "شما اجازه دسترسی به این سرویس را ندارید." });
            return;
        }
        var tariffs = await getAllAgentPlans(token.agentcode);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ isValid:true, result: tariffs });
    }
}