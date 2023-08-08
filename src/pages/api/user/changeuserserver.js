import { Redis } from "ioredis";
import RegisterCustomers from "src/databse/customers/registercustomers";
import GetServers from "src/databse/server/getservers";
import CreateUser from "src/databse/user/createuser";
import RegisterUsersInDB from "src/databse/user/registerusers";
import GetUsersBasketByUUID from "src/databse/usersbasket/getusersbasket";
import { CreateUserOnSoftEther } from "src/lib/createuser/createuser";
import { sendEmail } from "src/lib/emailsender";
import { ConvertToPersianDateTime, REDIS_URL } from "src/lib/utils";
import { SendMailToCustomers } from "./SenMail";
import { UpdateUsersBasket } from "src/databse/usersbasket/insertusersbasket";
import { PAID_CUSTOMER_STATUS } from "src/databse/usersbasket/PaidEnum";
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
      const { body } = req.body;

      var result =await ChangeUserServer(body);
      if(result==null)
        res.status(200).json({ name: "عملیات با شکست مواجه شد، لطفا با پشتیبانی تماس بگیرید."});
    


      var users = [];
      users.push(result);

      users.map((item,index)=>{
        item.username= item.userwithhub
      });

      res.status(200).json({ name: "سرور با موفقیت تغییر کرد"});
   }else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
    
  }





