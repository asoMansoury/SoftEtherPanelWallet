import RegisterCustomers, { RegisterCustomersForOthers } from "src/databse/customers/registercustomers";
import GetServers from "src/databse/server/getservers";
import CreateUser from "src/databse/user/createuser";
import RegisterUsersInDB from "src/databse/user/registerusers";
import GetUsersBasketByUUID from "src/databse/usersbasket/getusersbasket";
import { ConvertToPersianDateTime } from "src/lib/utils";
import { UpdateUsersBasket } from "src/databse/usersbasket/insertusersbasket";
import { PAID_CUSTOMER_STATUS } from "src/databse/usersbasket/PaidEnum";
import { apiUrls } from "src/configs/apiurls";
import { getToken } from "next-auth/jwt";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
import { CalculateWallet } from "src/databse/Wallet/UpdateWallet";
import { GetCustomerByEmail } from "src/databse/customers/getcustomer";
import { CreateUserOnCisco } from "src/lib/Cisco/createuser";
import { sendEmailCiscoChanged } from "src/lib/Emails/CiscoEmails/ChangedTypeEmail";



const SettinCiscoConfigForUsers = (selectedServer, users) => {
  var result = [];
  users.map((userItem, userIndex) => {
    userItem.ciscourl = selectedServer.ciscourl+":"+selectedServer.ciscoPort;
    result.push(userItem);
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
    if (token == null) {
      res.status(200).json({
        name: {
          isValid: false,
          message: "شما دسترسی  خرید اکانت ندارید."
        }
      });
      return;
    }
    var isAgent = await IsAgentValid(token.email);
    var agentCode = "";
    if (isAgent.isAgent == false) {
      var customer = await GetCustomerByEmail(token.email);
      if (customer.isfromagent == true && customer.agentIntoducer != '') {
        agentCode = customer.agentIntoducer
      } else {
        res.status(200).json({
          name: {
            isValid: false,
            message: "شما دسترسی  خرید اکانت ندارید."
          }
        });
        return;
      }
    } else {
      agentCode = isAgent.agentcode;
    }
    // Handle the POST request here
    const { UUID } = req.body;


    //   const redis = new Redis(REDIS_URL);
    var usersBasketObj = await GetUsersBasketByUUID(UUID);

    // Process the data or perform any necessary operations;
    if (usersBasketObj != null) {
      var registerCustomer = await RegisterCustomers(usersBasketObj, usersBasketObj.type);

      //get all servers to make a user
      var servers = await GetServers(apiUrls.types.SoftEther);

      var selectedServer = servers.filter((item) => item.servercode == usersBasketObj.servercode ? item : null)[0];

      var newUsers = await CreateUser(usersBasketObj);

      //put the new user into the database
      await CalculateWallet(registerCustomer.email, apiUrls.types.SoftEther, usersBasketObj.price, usersBasketObj);


      var userRegistered = [];
      await Promise.all(newUsers.map(async (userNew) => {
        var insertedUser = await RegisterUsersInDB(servers, userNew, apiUrls.types.SoftEther, selectedServer, agentCode);
        userRegistered.push(insertedUser);
      }));



      userRegistered.map((userItem, userIndex) => {
        CreateUserOnCisco(selectedServer,userItem.username,userItem.password,userItem.expires);
      })

      await UpdateUsersBasket(UUID, PAID_CUSTOMER_STATUS.PAID, true, userRegistered);

      let activedUserForSendingEmail = [];
      userRegistered.map((userItem, userIndex) => {
        userItem.expires = ConvertToPersianDateTime(userItem.expires);

        servers.map((server, index) => {
          if (server.servercode == selectedServer.servercode) {
            userItem.username = userItem.username;
            activedUserForSendingEmail.push(userItem);
          }
        });
      });

      var wrappedUsers = SettinCiscoConfigForUsers(selectedServer, activedUserForSendingEmail)
      sendEmailCiscoChanged(registerCustomer.email, wrappedUsers, selectedServer, "لطفا پاسخ ندهید. رسید اکانت خریداری شده");
      if (usersBasketObj.isSendToOtherEmail == true) {
        var otherObj = {
          email: usersBasketObj.sendEmailToOther
        };
        var otherToEmailCustomer = await RegisterCustomersForOthers(otherObj, apiUrls.types.SoftEther, token.agentcode);
        sendEmailCiscoChanged(otherToEmailCustomer.email, wrappedUsers, selectedServer, "لطفا پاسخ ندهید. رسید اکانت خریداری شده");

      }
      console.log({
        wrappedUsers
      })
      res.status(200).json({
        name: {
          basket: usersBasketObj,
          users: wrappedUsers,
          customer: registerCustomer,
          servers: servers,
          isValid: true
        }
      });
    }
    else {
      res.status(200).json({ name: "not avialbale" });
    }


  } else {
    console.log("method not allow")
    res.status(405).json({ message: 'Method Not Allowed' });
  }

}





