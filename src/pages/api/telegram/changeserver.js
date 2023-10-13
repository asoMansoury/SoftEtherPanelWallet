import { getToken } from "next-auth/jwt";
import { apiUrls } from "src/configs/apiurls";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
import GetServerByCode from "src/databse/server/getServerByCode";
import GetTelegramToken from "src/databse/telegram/TelegramToken";
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
      // Handle the POST request here
      const { username,servercode,currentservercode,token } = req.body;
      var body ={
        username,
        servercode,
        currentservercode,
        token
      };
      var telegramToken = await GetTelegramToken();
      if(telegramToken.isvalid==false){
        res.status(200).json({ name: "شما اجازه دسترسی به عملیات تعیین شده را ندارید."});
        return;
      }
      if(telegramToken.token != token){
        res.status(200).json({ name: "شما اجازه دسترسی به عملیات تعیین شده را ندارید."});
        return;
      }
      var result =await ChangeUserServer(body);
      const newSelectedServer = await GetServerByCode(result.currentservercode);
      if(result==null){
        res.status(200).json({ name: "عملیات با شکست مواجه شد، لطفا با پشتیبانی تماس بگیرید."});
        return;
      }
    


      var users = [];
      users.push(result);

      users.map((item,index)=>{
        item.username= item.userwithhub
      });

      if(newSelectedServer.type==apiUrls.types.Cisco){
        res.status(200).json({ name: `آدرس سرور جدید شما : ${newSelectedServer.ciscourl}`});
      }else if(newSelectedServer.type==apiUrls.types.OpenVpn||newSelectedServer.type==apiUrls.types.SoftEther){
        res.status(200).json({ name: `لینک دانلود سرور جدید ایمیل شد.`});
      }
   }else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
    
  }





