import { Redis } from "ioredis";
import GetServers from "src/databse/server/getservers";
import RevokeUser from "src/databse/user/CiscoMethods/RevokeUser";
import CreateUser from "src/databse/user/createuser";
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
      try{
        if (req.method === 'POST') {

          // Handle the POST request here
          const { username,tariffplancode,tariffcode,type,uuid } = req.body;

          var result = await RevokeUser(username,tariffplancode,tariffcode,type,uuid);
          
          res.status(200).json({ result});
        } else {
            console.log("method not allow")
          res.status(405).json({ name: 'Method Not Allowed' });
        }
      }catch(e){
        throw e;
      }

  }



