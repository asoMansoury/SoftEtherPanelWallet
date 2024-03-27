
import { Redis_Get_Data } from "src/redis/redisconnection";

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
        try{
            const { data } = req.body;
            var value = await Redis_Get_Data(data);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json({value});
        }catch(error){
            res.status(500).json({name:error});
        }
    }else {
        console.log("method not allow");
      res.status(405).json({ message: 'Method Not Allowed' });
    }
}