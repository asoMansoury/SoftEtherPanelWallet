
import { getSession } from "next-auth/react";
import { CalculateTotalPrice, CalculateTotalPriceModifed } from "src/databse/tariffagent/calculateTotalPrice";
import { getToken } from "next-auth/jwt"
import { GetAgentByUserCode, IsAgentValid } from "src/databse/agent/getagentinformation";
import { GetWalletUser } from "src/databse/Wallet/getWalletUser";
import { GetCustomerByEmail } from "src/databse/customers/getcustomer";


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
        if(customer.isfromagent==true){
          agentCode = customer.agentIntoducer
        }
      }else{
        agentCode = isAgent.agentcode;
      }

      var agentWallet =await GetWalletUser(token.email,"");
      if(agentWallet.isValid==false){
        res.status(200).json({ name: {
          isValid:false,
          message:"برای شما کیف پول تعریف نشده است لطفا با مدیریت در تماس باشید."
        } });
        return;
      }

      var result =await CalculateTotalPriceModifed(agentCode,body.tariffPlans,body.type);
      var checkHasCash = 0
      if(isAgent.isAgent==true)
         checkHasCash = agentWallet.cashAmount - result.ownerPrice;
      else
        checkHasCash = agentWallet.cashAmount - result.agentPrice;
      if(checkHasCash<0){
        res.status(200).json({ name: {
          isValid:false,
          message:"موجودی کیف پول شما برای خرید اکانت کافی نمی باشد. لطفا با مدیریت تماس بگیرید."
        } });
        return;
      }
              // Process the data or perform any necessary operations
      res.status(200).json({ name: result });
 

    } else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }



