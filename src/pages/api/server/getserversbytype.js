import GetServers from "src/databse/server/getservers";




export default async function handler(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if(req.method === "GET"){
        const {type } = req.query;

        var servers = await GetServers(type);
        var tmp = [];
        servers.map((item)=>{
            tmp.push({
                type:item.type,
                servercode:item.servercode,
                title:item.title
            })
        });
        res.status(200).json({name:tmp});
    }
}