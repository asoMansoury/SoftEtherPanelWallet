import { Redis } from "ioredis";
import { getToken } from "next-auth/jwt";
import GetServers from "src/databse/server/getservers";
import ChangeUserPassword from "src/databse/user/ChangeUserPassword";
import CreateUser from "src/databse/user/createuser";
import Login from "src/databse/user/login";
import RegisterUsersInDB from "src/databse/user/registerusers";
import { PAID_CUSTOMER_STATUS } from "src/databse/usersbasket/PaidEnum";
import InsertUsersBasket from "src/databse/usersbasket/insertusersbasket";
import { CreateUserOnSoftEther } from "src/lib/createuser/createuser";
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
        const token = await getToken({ req });
        if(token ==null ){
          res.status(200).json({ errorMsg:"شما دسترسی  به عملیات مورد نظر را ندارید.",isValid:false});
            return;
        }
      const { password } = req.body;
        var result = await ChangeUserPassword(password,token.email);
      
      
       res.status(200).json({ result});
    } else {
        console.log("method not allow")
      res.status(405).json({ name: 'Method Not Allowed' });
    }
  }



