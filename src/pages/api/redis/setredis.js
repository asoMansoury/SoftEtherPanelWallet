import { Redis_Set_Data } from "src/redis/redisconnection";

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
        const { data } = req.body;
        var objJson = JSON.stringify(data);
        await Redis_Set_Data(data.uuid, objJson);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:"OK"});
    }else {
        console.log("method not allow");
      res.status(405).json({ message: 'Method Not Allowed' });
    }
}