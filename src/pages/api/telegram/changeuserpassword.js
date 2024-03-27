import { Redis } from "ioredis";
import { getToken } from "next-auth/jwt";
import GetServers from "src/databse/server/getservers";
import GetTelegramToken from "src/databse/telegram/TelegramToken";
import ChangeUserPassword from "src/databse/user/ChangeUserPassword";
import CreateUser from "src/databse/user/createuser";
import Login from "src/databse/user/login";
import RegisterUsersInDB from "src/databse/user/registerusers";
import ChangeUserVpnPassword from "src/databse/user/repository/ChangeUserVpnPassword";
import { PAID_CUSTOMER_STATUS } from "src/databse/usersbasket/PaidEnum";
import InsertUsersBasket from "src/databse/usersbasket/insertusersbasket";
import { REDIS_URL } from "src/lib/utils";



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
        const { username,newpassword,token } = req.body;
        var telegramToken = await GetTelegramToken();
        if(telegramToken.isvalid==false){
          res.status(200).json({ name: "شما اجازه دسترسی به عملیات تعیین شده را ندارید."});
          return;
        }
        if(telegramToken.token != token){
          res.status(200).json({ name: "شما اجازه دسترسی به عملیات تعیین شده را ندارید."});
          return;
        }
        console.log(username,newpassword)
        var result = await ChangeUserVpnPassword(newpassword, username);


        res.status(200).json({ result });
    } else {
        console.log("method not allow")
        res.status(405).json({ name: 'Method Not Allowed' });
    }
}



