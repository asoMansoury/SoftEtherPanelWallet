import  { GetUserInformation } from "src/databse/user/getPurchasedAccounts";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {username } = req.query;
        var userBasket = await GetUserInformation(username);
        

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:userBasket});
    }
}