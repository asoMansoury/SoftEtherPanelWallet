import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import {  sendEmail, sendEmailCiscoClient, sendEmailCiscoClientTest, sendEmailTest } from 'src/lib/emailsender';
import { GenerateOneMonthExpiration, GenerateRandomPassword, GenerateTestExpiration, MONGO_URI, formatDate } from 'src/lib/utils';
import GetServers, { GetServersForTest } from '../server/getservers';
import { CreateUserOnCisco } from 'src/lib/Cisco/createuser';
import { CreateUserOnSoftEther } from 'src/lib/createuser/createuser';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
function generateRandomPassword(length) {
    let password = '';
    const possibleCharacters = '0123456789';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
      password += possibleCharacters.charAt(randomIndex);
    }
  
    return password;
}
  

async function GenerateNewAccount(email,selectedServer,type){
    const connectionState =  await client.connect();
    const db = client.db('SoftEther');
    const collection = db.collection('TestAccounts');
    var expireDate = GenerateTestExpiration(1);
    var  documents = await collection.find().sort({_id:-1}).limit(1).toArray();
    var num = documents[0].number + 1;
    var obj = {
        email:email,
        password:generateRandomPassword(5),
        expires:expireDate,
        servercode:selectedServer.servercode,
        type:type,
        removedFromServer:false,
        username:'test'+num,
        number:num
    }
    var insert =await collection.insertOne(obj);
    return obj;
}

export async function GenerateNewAccountTest(email,type,currentDomain,password){
    if(type=='' || type == undefined)
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TestAccounts');
        const documents = await collection.findOne({email:email,type:type});
        if(documents==null) {
            var selectedServer =await GetServersForTest(type);
            var insertTestAccount = await GenerateNewAccount(email,selectedServer,type);
            const selectedUser = await collection.findOne({email:email,type:type});
            console.log({selectedUser});
            var tmpUsers=[];
            if(type==apiUrls.types.Cisco)
                selectedUser.username = selectedUser.email;
            tmpUsers.push(selectedUser);
            var customerAccount = {
                username:email,
                password:selectedUser.password, 
                ovpnurl:selectedServer.ovpnurl
            };

            if(type==apiUrls.types.Cisco){
                CreateUserOnCisco(selectedServer,selectedUser.email,selectedUser.password);
                var sendingEmailResult =await sendEmailCiscoClientTest(email,tmpUsers,selectedServer,"لطفا پاسخ ندهید(اطلاعات اکانت تستی)",currentDomain,customerAccount);    
                console.log({sendingEmailResult});
            }else{
                customerAccount.username = insertTestAccount.username;
                console.log({tmpUsers});
                CreateUserOnSoftEther(selectedServer,customerAccount,"P1",selectedUser.expires);
                var sendingEmailResult =await sendEmailTest(email,tmpUsers,"لطفا پاسخ ندهید(اطلاعات اکانت تستی)",currentDomain,customerAccount)
                console.log({sendingEmailResult});
            }

            return {
                isValid:true,
                message:'اکانت تست به ایمیل شما ارسال گردید.'
            };
        }



        return {
            isValid:false,
            message:`برای ایمیل ${email} قبلا اکانت تستی صادر شده است.`
        }


    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function IsValidForCreatingNewTestAccount(email,type){
    if(type=='' || type == undefined)
        type = apiUrls.types.Cisco;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TestAccounts');
        const documents = await collection.findOne({email:{ $regex: `^${email}$`, $options: "i" }, type:type});
        if(documents != null)
            return {
                isValid:false,
                message:`برای ایمیل ${email} قبلا اکانت تستی صادر شده است.`
            }

        return {
            isValid:true,
            message:``
        };
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


