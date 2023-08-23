import { Redis } from "ioredis";
import RegisterCustomers, { RegisterCustomersForOthers } from "src/databse/customers/registercustomers";
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
import { apiUrls } from "src/configs/apiurls";
import { getToken } from "next-auth/jwt";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
import { CalculateWallet } from "src/databse/Wallet/UpdateWallet";
import { GetCustomerByEmail } from "src/databse/customers/getcustomer";


const SettinOvpnUrlForUsers = (servers,users)=>{
  var result = [];
  users.map((userItem,userIndex)=>{
    const serverCode = userItem.serverId.filter(server => server.policy !== "D1").map(server => server.servercode);
    if(serverCode.length > 0){
      serverCode.map((itemCode,indexCode)=>{
        var selectedServer = servers.filter(server => server.servercode === itemCode)[0];
        userItem.ovpnurl = selectedServer.ovpnurl;
        result.push(userItem);
      })
    }
  });

  return result;
}

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
      const currentDomain = req.headers.host;
      const token = await getToken({ req });
      if(token ==null ){
          res.status(200).json({ name: {
            isValid:false,
            message:"شما دسترسی  خرید اکانت ندارید."
          } });
          return;
      }
      var isAgent =await IsAgentValid(token.email);
      var agentCode = "";
      if(isAgent.isAgent==false){
        var customer = await GetCustomerByEmail(token.email);
        if(customer.isfromagent==true && customer.agentIntoducer!=''){
          agentCode = customer.agentIntoducer
        }else{
          res.status(200).json({ name: {
            isValid:false,
            message:"شما دسترسی  خرید اکانت ندارید."
          } });
          return;
        }
      }else{
        agentCode = isAgent.agentcode;
      }
      // Handle the POST request here
      const { UUID } = req.body;

      
      //   const redis = new Redis(REDIS_URL);
      var usersBasketObj = await GetUsersBasketByUUID(UUID);

      // Process the data or perform any necessary operations;
       if(usersBasketObj != null){
        var registerCustomer = await RegisterCustomers(usersBasketObj,usersBasketObj.type);
        
        //get all servers to make a user
         var servers = await GetServers(apiUrls.types.SoftEther);

         var selectedServer = servers.filter((item)=> item.servercode == usersBasketObj.servercode?item:null)[0];

         var newUsers =await CreateUser(usersBasketObj);

        //put the new user into the database
        await CalculateWallet(registerCustomer.email,apiUrls.types.SoftEther,usersBasketObj.price);

        var userRegistered = [];
        await Promise.all(newUsers.map(async (userNew) => {
        var insertedUser = await RegisterUsersInDB(servers, userNew,apiUrls.types.SoftEther,selectedServer,agentCode);
          userRegistered.push(insertedUser);
        }));
        


        userRegistered.map((userItem,userIndex)=>{
          var expireDate = userItem.expires;
          servers.map((server,index)=>{
            var groupPolicy = server.servercode == selectedServer.servercode ?userItem.policy : server.policy;
            if(server.servercode == selectedServer.servercode)
              CreateUserOnSoftEther(server,userItem,groupPolicy,expireDate);
         });
        })

        await  UpdateUsersBasket(UUID,PAID_CUSTOMER_STATUS.PAID,true,userRegistered);

        let activedUserForSendingEmail  = [];
        userRegistered.map((userItem,userIndex)=>{
          userItem.expires = ConvertToPersianDateTime(userItem.expires);

          servers.map((server,index)=>{
            if(server.servercode == selectedServer.servercode){
                userItem.username = userItem.username + '@' + server.HubName;
                activedUserForSendingEmail.push(userItem);
            }  
         });
        });

        var wrappedUsers = SettinOvpnUrlForUsers(servers,activedUserForSendingEmail)
        
        sendEmail(registerCustomer.email,wrappedUsers,"لطفا پاسخ ندهید. رسید اکانت خریداری شده",currentDomain,registerCustomer);
        if(usersBasketObj.isSendToOtherEmail==true){
          var otherObj = {
            email:usersBasketObj.sendEmailToOther
          };
          var otherToEmailCustomer = await  RegisterCustomersForOthers(otherObj,apiUrls.types.Cisco,token.agentcode);
          sendEmail(otherToEmailCustomer.email,wrappedUsers,"لطفا پاسخ ندهید. رسید اکانت خریداری شده" , currentDomain,otherToEmailCustomer);
          
      }
        res.status(200).json({ name: {
          basket:usersBasketObj,
          users: wrappedUsers,
          customer:registerCustomer,
          servers:servers,
          isValid:true
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





