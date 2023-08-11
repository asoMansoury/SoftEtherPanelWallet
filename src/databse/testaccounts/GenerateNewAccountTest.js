import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import {  sendEmailCiscoClient, sendEmailCiscoClientTest } from 'src/lib/emailsender';
import { GenerateOneMonthExpiration, GenerateRandomPassword, GenerateTestExpiration, MONGO_URI, formatDate } from 'src/lib/utils';
import GetServerByCode from '../server/getServerByCode';
import GetServers, { GetServersForTest } from '../server/getservers';
import { CreateUserOnCisco } from 'src/lib/Cisco/createuser';
import { GetCustomerByEmail } from '../customers/getcustomer';
import { DeleteUserCisco } from 'src/lib/Cisco/deleteuser';


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

    var obj = {
        email:email,
        password:generateRandomPassword(5),
        expires:expireDate,
        servercode:selectedServer.servercode,
        type:type,
        removedFromServer:false
    }
    var insert =await collection.insertOne(obj);
}

export async function GenerateNewAccountTest(email,type,currentDomain,password){
    if(type=='' || type == undefined)
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TestAccounts');
        const documents = await collection.findOne({email:email});

        if(documents==null) {
            var selectedServer =await GetServersForTest(type);
            var insertTestAccount = await GenerateNewAccount(email,selectedServer,type);
            const selectedUser = await collection.findOne({email:email});
            CreateUserOnCisco(selectedServer,selectedUser.email,selectedUser.password);
            var tmpUsers=[];
            selectedUser.username = selectedUser.email;
            tmpUsers.push(selectedUser);
            var customerAccount = {
                username:email,
                password:password,
            };
            sendEmailCiscoClientTest(email,tmpUsers,selectedServer,"لطفا پاسخ ندهید(اطلاعات اکانت تستی)",currentDomain,customerAccount);
            
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
        const documents = await collection.findOne({email:{ $regex: `^${email}$`, $options: "i" }});
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


