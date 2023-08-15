import { getToken } from "next-auth/jwt";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
import GetServerByCode from "src/databse/server/getServerByCode";
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
        const token = await getToken({ req });
        if(token ==null ){
          res.status(200).json({ name:"شما دسترسی  به عملیات مورد نظر را ندارید."});
            return;
        }
      // Handle the POST request here
      const { body } = req.body;
      const selectedServer = GetServerByCode(body.servercode);
      var result =await ChangeUserServer(body);
      if(result==null){
        res.status(200).json({ name: "عملیات با شکست مواجه شد، لطفا با پشتیبانی تماس بگیرید."});
        return;
      }
    


      var users = [];
      users.push(result);

      users.map((item,index)=>{
        item.username= item.userwithhub
      });

      res.status(200).json({ name: `آدرس سرور جدید شما : ${selectedServer.ciscourl}`});
   }else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
    
  }





