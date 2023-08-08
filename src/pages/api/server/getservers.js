import GetServers from "src/databse/server/getservers";




export default async function handler(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if(req.method === "GET"){
        var servers = await GetServers();
        res.status(200).json({name:servers});
    }
}