import { getTariffs } from "src/databse/tariff/getTariff";



export default async function handler(req,res){
    if(req.method === "GET"){
        const {type } = req.query;
        var tariffs = await getTariffs(type);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:tariffs});
    }
}