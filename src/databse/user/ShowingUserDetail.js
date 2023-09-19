import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI, formatDate } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



export async function GetUserDetails(username,agentcode) {
    try {
        var result = {
            isValid:false,
            errorMsg:"کاربر وارد شده وجود ندارد.",
            user:{
                username:"",
                password:""
            }
        }
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');
        const UserCollection = db.collection('Users');
        var user = await UserCollection.findOne({username:username});
        if(user==null)
            return result;

        var userDetail =await collection.findOne({email:user.email});
        if(userDetail.agentcode!=agentcode){
            result.errorMsg = "مجاز به عملیات انجام نمی باشید."
            return result;
        }
        result.isValid = true;
        result.email = userDetail.email;
        result.password = userDetail.password;
        result.user.username = user.username;
        result.user.password = user.password;
        result.errorMsg = "";
        return result;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}





export default GetUserDetails;