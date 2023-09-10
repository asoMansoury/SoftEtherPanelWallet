import { getToken } from "next-auth/jwt";
import { GetWalletUser } from "src/databse/Wallet/getWalletUser";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {email} = req.query;
        // const token = await getToken({ req });
        // if(token ==null){
        // res.status(200).json({ name: {
        //     isValid:false,
        //     message:"دسترسی نامعتبر."
        //     } });
        //     return;
        // }
        var wallet = await GetWalletUser(email);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:wallet});
    }
}