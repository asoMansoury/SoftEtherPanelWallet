
import { PAID_CUSTOMER_STATUS } from "src/databse/usersbasket/PaidEnum";
import InsertUsersBasket from "src/databse/usersbasket/insertusersbasket";
import { Redis_Delete_Key, Redis_Get_Data } from "src/redis/redisconnection";



export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(200).end();

        return;
      }
      try{
        if (req.method === 'POST') {

          const { UUID } = req.body;
    
          console.log("ready for connecting to redis .... ");
          var getDataFromRedis = await Redis_Get_Data(UUID);
          var parsedObject= JSON.parse(getDataFromRedis);
          var result = await InsertUsersBasket(parsedObject,PAID_CUSTOMER_STATUS.WAITING);
          await Redis_Delete_Key(UUID);
          
          res.status(200).json({ result});
          
        } else {
            console.log("method not allow")
          res.status(405).json({ name: 'Method Not Allowed' });
        }
      }catch(e){
        throw e;
      }

  }



