import {MongoClient,ServerApiVersion} from 'mongodb';
import {  MONGO_URI } from 'src/lib/utils';
import { PAID_CUSTOMER_STATUS } from './PaidEnum';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function GetAgentInvoice(username){
    try{
        const connectionState =  await client.connect();

        const db = client.db('SoftEther');
        const customerCollection = db.collection('Customers');
        const basketCollection = db.collection('UsersBasket');

        var customer =await customerCollection.findOne({agentcode:{ $regex: `^${username}$`, $options: "i" }});
        if(customer ==null)
            return [];

        
        const result = await basketCollection.find({
                                                'agentInformation.agentcode': customer.agentcode,
                                                "isFromAgent":true,
                                                "isSetteledWithAgent":false,
                                                "customer_paying_status.code":PAID_CUSTOMER_STATUS.PAID.code
                                                }).toArray();
                                                
        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}





export default GetAgentInvoice;