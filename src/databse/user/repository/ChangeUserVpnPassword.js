import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import { GetServerByTypeAndCode } from 'src/databse/server/getservers';
import { ChangePasswordCisco } from 'src/lib/Cisco/changepassword';
import { ChangeOpenVPNUserPassword } from 'src/lib/OpenVpn/ChangeOpenVPNUserPassword';
import { MONGO_URI } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function ChangeUserVpnPassword(password,username){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const customerCollection = db.collection('Users');
        
        var user =await customerCollection.findOne({ 
            username: { $regex: `^${username}$`, $options: "i" }
        });
        const selectedServer = await GetServerByTypeAndCode(user.type,user.currentservercode);
        if(user!=null) 
        {   
            const filter = {username:username};
            const updatedDoc = {$set:{
                password:password
            }};
            var result = await customerCollection.updateOne(filter,updatedDoc);
            user.password = password;
            if(user.type==apiUrls.types.OpenVpn){

                ChangeOpenVPNUserPassword(selectedServer,user);
            }else if(user.type==apiUrls.types.Cisco||user.type==apiUrls.types.SoftEther){
                ChangePasswordCisco(selectedServer,username,password);
            }
            return {
                isValid:true
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

export default ChangeUserVpnPassword;