import SendAccountToEmail from "src/databse/user/sendAccountToEmail";
import { sendEmail } from "src/lib/emailsender";
import { ConvertToPersianDateTime } from "src/lib/utils";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {email } = req.query;
        var users = await SendAccountToEmail(email);

        users.map((userItem,userIndex)=>{
            userItem.expires = ConvertToPersianDateTime(userItem.expires);
          })
          
        sendEmail(email,users,"لطفا پاسخ ندهید. لیست اکانت های خریداری شده");

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:"لیست اکانت ها به ایمیل شخصی شما ارسال گردید."});
    }
}