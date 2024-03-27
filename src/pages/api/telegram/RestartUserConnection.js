import { getToken } from "next-auth/jwt";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
import GetTelegramToken from "src/databse/telegram/TelegramToken";
import RestartUserConnection from "src/databse/user/UsersFunction/DeleteUsers";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username,token } = req.body;
        var telegramToken = await GetTelegramToken();
        if(telegramToken.isvalid==false){
          res.status(200).json({ name: "شما اجازه دسترسی به عملیات تعیین شده را ندارید."});
          return;
        }
        if(telegramToken.token != token){
          res.status(200).json({ name: "شما اجازه دسترسی به عملیات تعیین شده را ندارید."});
          return;
        }
        var userBasket = await RestartUserConnection(username);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ name: userBasket });
    }
}