import { getToken } from "next-auth/jwt";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
import GetServerByCode from "src/databse/server/getServerByCode";
import GetTelegramToken from "src/databse/telegram/TelegramToken";
import ConvertUsers from "src/databse/user/ConvertUsers";
import ChangeUserServer from "src/databse/user/changeUserServer";



export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {

        // Allow CORS preflight request
        res.status(200).end();

        return;
      }
    if (req.method === 'POST') {
      const { username,newType,servercode,token } = req.body;
      var telegramToken = await GetTelegramToken();
      if(telegramToken.isvalid==false){
        res.status(200).json({ name: "شما اجازه دسترسی به عملیات تعیین شده را ندارید."});
        return;
      }
      if(telegramToken.token != token){
        res.status(200).json({ name: "شما اجازه دسترسی به عملیات تعیین شده را ندارید."});
        return;
      }
      var result =await ConvertUsers(username,newType,servercode);
      console.log({result});
      if(result==null){
        res.status(200).json({isValid:false, name: "عملیات با شکست مواجه شد، لطفا با پشتیبانی تماس بگیرید."});
        return;
      }
    



      res.status(200).json({isValid:true, name: "عملیات با موفقیت انجام گردید."});
   }else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
    
  }





