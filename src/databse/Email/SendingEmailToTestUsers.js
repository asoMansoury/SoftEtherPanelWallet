import { MongoClient, ServerApiVersion } from 'mongodb';
import { SendEmailToTests } from 'src/lib/Emails/SendEmailToTests';
import { sendEmail } from 'src/lib/emailsender';
import { MONGO_URI } from 'src/lib/utils';
import { GetAgentByAgentCode } from '../agent/getagentinformation';

const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function SendinEmailToTestUsers(email, content,token) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');
        const testedAccountCollection = db.collection('TestAccounts');
        var testAccount = await testedAccountCollection.findOne({email:email});
        var Agent = await GetAgentByAgentCode(token.agentcode);
        console.log({content});
        if(content==null || content == "" || content == undefined){
            content = "کاربر گرامی متوجه شدم که اکانت تستی دریافت کردید در صورتی که مشکلی در اتصال داشتید لطفا به کانال من که بالا ایمیل هست، پیام بدید که راهنماییتون کنم."
        }
        var telegramChannel = {
            hasTelegram:false,
            telegramId:"",
        };
        if(Agent.isAgentValid ==true){
            if(Agent.agentInformation.hasOwnProperty("telegram")){
                telegramChannel.hasTelegram = true;
                telegramChannel.telegramId = Agent.agentInformation.telegram;
            }
        }
        await SendEmailToTests(email, "پشتیبانی اکانت تستی", content,telegramChannel)
        testAccount.hasSentEmail= true;
        testedAccountCollection.updateOne(
            { email: email },
            { $set: {hasSentEmail:true} }
        )
        return {
            isValid: true,
            errorMessage: "ایمیل ارسال گردید."
        };
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}

export default SendinEmailToTestUsers;