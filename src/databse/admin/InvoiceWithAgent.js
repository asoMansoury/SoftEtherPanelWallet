import {MongoClient,ServerApiVersion} from 'mongodb';
import {  MONGO_URI } from 'src/lib/utils';
import GetAgentInvoice from '../usersbasket/getAgentInvoice';

const options = { useNewUrlParser: true, useUnifiedTopology: true };

const client = new MongoClient(MONGO_URI,options,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function InvoiceWithAgent(agentCode,amount){
    try{
        const connectionState =  await client.connect();

        const db = client.db('SoftEther');

        const customerCollection = db.collection('PaidToAgents');
        const agentBill =await GetAgentInvoice(agentCode);
        const basketCollection = db.collection('UsersBasket');

        var calculatedAgents = [];
        var remainInvoice = amount;
        agentBill.map(async (bill)=>{
            var remainAmount = 0;
            if(remainInvoice>0){
                bill.originDebit = bill.debitToAgent;
                if(bill.debitToAgent == remainInvoice){
                    remainAmount = bill.debitToAgent - remainInvoice;
                    remainInvoice = 0;
                }else if(bill.debitToAgent > remainInvoice){
                    remainAmount = bill.debitToAgent - remainInvoice;
                    remainInvoice = 0;
                }else if(bill.debitToAgent < remainInvoice){
                    remainAmount =0;
                    remainInvoice = remainInvoice - bill.debitToAgent;
                }

                if(remainAmount==0)
                    bill.isSetteledWithAgent = true;
                bill.debitToAgent = remainAmount;
                calculatedAgents.push(bill);
                if(remainInvoice==0)
                    return;
            }
        });

        //Update multiple documents in bulk
        calculatedAgents.forEach(async (doc)=>{
            const filter = { _id: doc._id };
            const updateOperation = { $set: doc };
            await basketCollection.updateOne(filter, updateOperation);
        })

        var Obj = {
            PaidAmount:amount,
            AgentCode:agentCode,
            AffectedBaskets:calculatedAgents
        }
        
        await customerCollection.insertOne(Obj);
        


        return calculatedAgents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

  // Function to update the documents in the collection
async function updateDocuments(collection, data) {
    const session = collection.client.startSession();
  
    try {
      session.startTransaction();
  
      for (const document of data) {
        const filter = { _id: document._id };
        const updateOperation = { $set: document };
  
        await collection.updateOne(filter, updateOperation, { session });
        console.log('Document updated successfully');
      }
  
      await session.commitTransaction();
    } catch (error) {
      console.log("error : ",error);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }




export default InvoiceWithAgent;