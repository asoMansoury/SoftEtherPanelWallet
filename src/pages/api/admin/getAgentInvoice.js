import GetAgentInvoice from "src/databse/usersbasket/getAgentInvoice";





export default async function handler(req,res){
    if(req.method === "GET"){
        const {username } = req.query;
        var userBasket = await GetAgentInvoice(username);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:userBasket});
    }
}