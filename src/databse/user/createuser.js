import {MongoClient,ServerApiVersion} from 'mongodb';
import { GenerateOneMonthExpiration, GenerateRandomPassword, GenerateThreeMonthExpiration, MONGO_URI, generateRandomNumberPassword } from 'src/lib/utils';
import { getTarrifPlans } from '../tarrifplans/getTarrifPlans';
import { apiUrls } from 'src/configs/apiurls';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const createUserFunction = (userObj,duration) => {
    
    return {
        
        // username:userObj.userprefix+number,
        username:userObj.userprefix+userObj.usernumber,
        password: generateRandomNumberPassword(5),
        usernumber: userObj.usernumber,
        tariffplancode:userObj.tariffplancode,
        usercounter: userObj.usercounter ,
        isCreatedInServer:false,
        policy:userObj.policy,
        email:userObj.email,
        agentcode:"",
        isfromagent:userObj.isfromagent,
        expires:GenerateOneMonthExpiration(duration)
    }
}

const generateUserPrefix =(userAgent) => {
    return userAgent.agentInformation.agentprefix;
}
async function CreateUser(userBasketObj){
    var type = userBasketObj.type;
    try{
        var userCreated = [];
        var isFromAgent = userBasketObj.isFromAgent;
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');

        var documents = [];
        if(isFromAgent==false)
            documents = await collection.find({username: { $regex: '^User' }}).sort({_id:-1}).limit(1).toArray();
        else{
            var pattern = userBasketObj.agentInformation.agentprefix;
            documents = await collection.find({username: { $regex: `^${pattern}` }}).sort({_id:-1}).limit(1).toArray();
        }
            

        const tariffPlans = await getTarrifPlans(type);
        var usernumber = 100;
        var usercounter = 0;
        if(isFromAgent==true&&documents[0]!=undefined){
            var lastUser = documents[0];
            usernumber = lastUser.usernumber+1;
            usercounter = lastUser.usercounter+1;
        }else if(documents[0]!=undefined){
            var lastUser = documents[0];
            usernumber = lastUser.usernumber+1;
            usercounter = lastUser.usercounter+1;
        }else{
            usernumber=usernumber+1;
            usercounter=usercounter+1;
        }
        

        userBasketObj.tariffPlans.map((planItem,index)=>{
            var selectedTarifPlan = tariffPlans.find(e=>e.code === planItem.tariffplancode); 
            if(documents[0]==undefined) {
                var obj = {
                    usercounter:usercounter+1,
                    usernumber:usernumber+1,
                    email:userBasketObj.email,
                    userprefix:generateUserPrefix(userBasketObj),
                    uuid:userBasketObj.uuid,
                    policy:planItem.tarrifcode,
                    tariffplancode:planItem.tariffplancode,
                    type:userBasketObj.type,
                    isfromagent:isFromAgent
                }
                var generatedUser = createUserFunction(obj,selectedTarifPlan.duration)
                userCreated.push(generatedUser);
            }else{
                var userPrefix = generateUserPrefix(userBasketObj);

                var obj = {
                    usercounter:usercounter,
                    usernumber:usernumber,
                    userprefix:userPrefix,
                    uuid:userBasketObj.uuid,
                    policy:planItem.tarrifcode,
                    tariffplancode:planItem.tariffplancode,
                    email:userBasketObj.email,
                    type:userBasketObj.type,
                    isfromagent:isFromAgent
                }
                userCreated.push(createUserFunction(obj,selectedTarifPlan.duration));
            }
            usernumber++;
            usercounter++;
        })

        return userCreated;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        //client.close();
    }
}

export default CreateUser;