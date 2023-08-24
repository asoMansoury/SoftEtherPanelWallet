import { getToken } from "next-auth/jwt";
import { getAllTariffPrices } from "src/databse/tarrifplans/getTarrifPlans";



export default async function handler(req,res){
    if(req.method === "GET"){
        const {type } = req.query;
        var token = await getToken({req});
        if(token==null)
            return;
        var tariffs = await getAllTariffPrices();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:tariffs});
    }
}