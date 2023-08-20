import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { getAllTariffs } from '../tariff/getTariff';
import { getAllTariffPrices } from '../tarrifplans/getTarrifPlans';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function registerAgentPrice(agentcode, plans) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TariffAgent');
        const documents = await collection.find({ agentcode: agentcode }).toArray();

        await Promise.all(documents.map(async (item) => {
            var selectedPlan = plans.filter((e) => e.tarrifcode === item.tarrifcode
                && e.tariffplancode === item.tariffplancode
                && e.type == item.type)[0];
            item.agentprice = selectedPlan.agentprice;
            console.log({item});
            await collection.updateOne(
                { _id: item._id },
                { $set: item }
            )
        }));

        console.log({ documents });
        return documents;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}




