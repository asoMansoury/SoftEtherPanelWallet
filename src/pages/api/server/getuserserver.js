import { apiUrls } from "src/configs/apiurls";
import GetUsersServer from "src/databse/server/getUsersServer";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {username } = req.query;
        var userServer = await GetUsersServer(username);
        var result= [];

        userServer.map((item,index)=>{
            var obj = {
                servercode:item.servercode,
                description:item.description,
                title:item.title,
                type:item.type,
            }
            if(item.type== apiUrls.types.SoftEther)
                obj.url = item.ovpnurl;
            else if(item.type== apiUrls.types.Cisco)
                obj.url = item.ciscourl;
            result.push(obj)
        })
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:result});
    }
}