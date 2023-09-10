import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import GetServers, { GetServersByTypeAndCode } from '../server/getservers';
import { apiUrls } from 'src/configs/apiurls';
import { CreateUserOnCisco } from 'src/lib/Cisco/createuser';
import { CreateUserOnOpenVpn } from 'src/lib/OpenVpn/CreateUserOpenVpn';
import { DeleteUserCisco } from 'src/lib/Cisco/deleteuser';
import GetServerByCode from '../server/getServerByCode';
import { RemoveUserOpenVpn } from 'src/lib/OpenVpn/RemoveUserOpenVpn';
import { sendEmailCiscoClient } from 'src/lib/emailsender';
import { sendEmailCiscoChanged } from 'src/lib/Emails/CiscoEmails/ChangedTypeEmail';
import { OpenVpnConvertedEmail } from 'src/lib/Emails/OpenVpnEmails/OpenVpnConvertedEmail';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function ConvertUsers(username,newType,selectedServer,Token){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const customerCollection = db.collection('Users');
        var user =await customerCollection.findOne({ 
            username: { $regex: `^${username}$`, $options: "i" }
        });
        var prevServer = await GetServerByCode(user.currentservercode);
        var selectedNewServer =await GetServersByTypeAndCode(newType)[0];
        if(user!=null) 
        {
            if(user.type==apiUrls.types.Cisco){
                DeleteUserCisco(prevServer,user.username);
            }else if(user.type == apiUrls.types.OpenVpn){
                RemoveUserOpenVpn(prevServer,user);
            }

            if(newType == apiUrls.types.Cisco){
                CreateUserOnCisco(selectedNewServer,user.username,user.password,user.expires);
                var users= [];
                users.push(user);
                sendEmailCiscoChanged(user.email,users,selectedNewServer,"تغییر نوع اکانت به سیسکو");
            }else if(newType == apiUrls.types.OpenVpn){
                CreateUserOnOpenVpn(selectedNewServer,user,user.expires);
                user.ovpnurl = selectedNewServer.ovpnurl;
                var users = [];
                users.push(user);
                OpenVpnConvertedEmail(user.email,[],"تغییر نوع اکانت به اپن وی پی ان")
            }
        }else{
            return {
                isValid:false,
                errorMsg:"کاربر مورد نظر وجود ندارد."
            }
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default ConvertUsers;