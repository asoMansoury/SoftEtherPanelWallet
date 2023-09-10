
import { GetUsersByUsernameAndPassword } from "src/databse/user/GetUsersByUsernameAndPassword";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {username,password } = req.query;
        var userBasket = await GetUsersByUsernameAndPassword(username,password);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:userBasket});
    }
}