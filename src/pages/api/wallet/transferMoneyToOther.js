
import { getToken } from "next-auth/jwt";
import { GetWalletUser, TransferMoneyToOtherAccount } from "src/databse/Wallet/getWalletUser";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
import CheckIsUserExists from "src/databse/customers/checkuserexists";
import RegisterCustomers from "src/databse/customers/registercustomers";

async function handler(req, res) {

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', ' *');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Allow CORS preflight request
        res.status(200).end();

        return;
    }
    if (req.method === 'POST') {
        // Handle the POST request here
        // Handle the POST request here
        var { email, amount, isAccepted, cash } = req.body;
        var token = await getToken({req});
        if(token == null){
            res.status(200).json({
                name: {
                    isValid: false,
                    message: "دسترسی نامعتبر"
                }
            });
            return;
        }
        if (isAccepted == true) {
            res.status(200).json({
                name: {
                    isValid: false,
                    message: "تیک توافقنامه وارد نشده است."
                }
            });
            return;
        }

        if (email == token.email) {
            setError({
              isValid: false,
              errorMessage: "نمی توانید به ایمیل شخصی خودتان پول واریز کنید"
            });
            return;
        }
        var isAgent =await IsAgentValid(token.email);
        if(isAgent.isAgent==false){
            res.status(200).json({
                name: {
                    isValid: false,
                    message: "دسترسی به عملیات مورد نظر ندارید"
                }
            });
            return;
        }

        var userWallet =await GetWalletUser(token.email);
        if (parseInt(amount) > parseInt(userWallet.cashAmount)) {
            res.status(200).json({
                name: {
                    isValid: false,
                    message: "مبلغ انتقالی نباید از موجودی حساب شما بیشتر باشد."
                }
            });
            return;
        }

        var transferResult= await TransferMoneyToOtherAccount(token.email,email,amount);
        res.status(200).json({ name: {
            isValid: transferResult.isValid,
            message: "عملیات با موفقیت انجام گردید."
        } });
    } else {
        console.log("method not allow", req.method)
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default handler






