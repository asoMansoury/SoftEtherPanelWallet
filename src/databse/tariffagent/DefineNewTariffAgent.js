import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { getAllTariffs } from '../tariff/getTariff';
import { getAllTariffPrices } from '../tarrifplans/getTarrifPlans';
import { TariffAgentDto } from './DTOs/tariffagentDto';
import { tariffAgentWrapper } from './Utils/tariffAgentUtils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function DefineNewTariffAgent(plans, agentcode) {
  
    try {
      await client.connect();
      const db = client.db('SoftEther');
      const collection = db.collection('TariffAgent');
      const tmp = plans.map((item) => {
        return new TariffAgentDto(
          agentcode,
          item.tarrifcode,
          item.price,
          item.agentprice,
          item.tariffplancode,
          item.type
        );
      });
  
      const result = await collection.insertMany(tmp);
  
      return result.ops;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      await client.close();
    }
  }