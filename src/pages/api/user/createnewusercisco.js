import RegisterCustomers from "src/databse/customers/registercustomers";
import GetServers from "src/databse/server/getservers";
import CreateUser from "src/databse/user/createuser";
import  { RegisterUsersInDBForCisco } from "src/databse/user/registerusers";
import GetUsersBasketByUUID from "src/databse/usersbasket/getusersbasket";
import { ConvertToPersianDateTime, REDIS_URL } from "src/lib/utils";
import { apiUrls } from "src/configs/apiurls";
import { CreateUserOnCisco } from "src/lib/Cisco/createuser";
import { UpdateUsersBasket } from "src/databse/usersbasket/insertusersbasket";
import { sendEmail, sendEmailCiscoClient } from "src/lib/emailsender";
import { PAID_CUSTOMER_STATUS } from "src/databse/usersbasket/PaidEnum";
import { GetAgentByUserCode, IsAgentValid } from "src/databse/agent/getagentinformation";
import { getToken } from "next-auth/jwt";



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
          res.status(200).json({ name: {
            isValid:false,
            message:"شما دسترسی  خرید اکانت ندارید."
          } });
          return;
      }
      var isAgent =await IsAgentValid(token.email);
      if(isAgent.isAgent==false){
        res.status(200).json({ name: {
          isValid:false,
          message:"شما دسترسی  خرید اکانت ندارید."
        } });
        return;
      }
      //validation that just agents has access to buy products
      
      // Handle the POST request here
      const { UUID } = req.body;

      
      //   const redis = new Redis(REDIS_URL);
      var usersBasketObj = await GetUsersBasketByUUID(UUID);

      // Process the data or perform any necessary operations;
       if(usersBasketObj != null){
          var registerCustomer =  await RegisterCustomers(usersBasketObj,apiUrls.types.Cisco);
        
         
        //get all servers to make a user
         var servers = await GetServers(apiUrls.types.Cisco);

         var selectedServer = servers.filter((item)=> item.isactive==true?item:null)[0];
         
         var newUsers =await CreateUser(usersBasketObj);

        //put the new user into the database
        var userRegistered = [];
        await Promise.all(newUsers.map(async (userNew) => {
        var insertedUser = await RegisterUsersInDBForCisco(servers, userNew,apiUrls.types.Cisco,usersBasketObj.agentInformation);
          userRegistered.push(insertedUser);
        }));


        userRegistered.map((userItem,userIndex)=>{
          servers.map((server,index)=>{
            if(server.isactive==true){
              CreateUserOnCisco(server,userItem.username,userItem.password);
            }
         });
        })

        let activedUserForSendingEmail  = [];
        userRegistered.map((userItem,userIndex)=>{
          userItem.expires = ConvertToPersianDateTime(userItem.expires);

          servers.map((server,index)=>{
            if(server.isactive){
                userItem.username = userItem.username;
                userItem.ciscourl = server.ciscourl+":"+server.ciscoPort;
                activedUserForSendingEmail.push(userItem);
            }  
         });
        })
        
      UpdateUsersBasket(UUID,PAID_CUSTOMER_STATUS.PAID,true,userRegistered,usersBasketObj);

      
      sendEmailCiscoClient(usersBasketObj.email,newUsers,selectedServer,"لطفا پاسخ ندهید. رسید اکانت خریداری شده");
      
      res.status(200).json({ name: {
        basket:usersBasketObj,
        users: activedUserForSendingEmail,
        customer:registerCustomer,
        servers:servers
      }});
   }
   else{
    res.status(200).json({ name: "not avialbale"});
   }


    } else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
    
  }





