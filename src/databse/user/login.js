import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function Login(body){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const customerCollection = db.collection('Customers');
        const agentCollection = db.collection('Agents');
        var user =await customerCollection.findOne({ 
            email: { $regex: `^${body.email}$`, $options: "i" }, 
            password: body.password 
        });
        console.log({user});
        if(user!=null) 
        {   
            user.isCustomer = true;
            user.isAgent=false;
            var agent = await agentCollection.findOne({agentcode:user.agentcode});
            if(agent!=null)
                user.isAgent=true;
        }
        
        return user;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default Login;