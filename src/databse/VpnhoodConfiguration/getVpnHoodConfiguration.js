import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { VpnHoodConfigDto } from './VpnhoodConfigurationDto';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function GetVpnHoodConfiguration(type){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const vpnhoodConifgurationCollection = db.collection('VpnhoodConfig');
        const vpnHoodConfiguration =await vpnhoodConifgurationCollection.findOne({ type: type });
        return new VpnHoodConfigDto(vpnHoodConfiguration.bearerToken,
                                    vpnHoodConfiguration.owner,
                                    vpnHoodConfiguration.projectId,
                                    vpnHoodConfiguration.type,
                                    vpnHoodConfiguration.vpnhoodBaseUrl);
    }catch(erros){
        console.log(erros)
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function GetVpnHoodConfigurationByOwner(owner){
    try{
        console.log('tyring to get vpnHood configuration');
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const vpnhoodConifgurationCollection = db.collection('VpnhoodConfig');
        const vpnHoodConfiguration =await vpnhoodConifgurationCollection.findOne({ owner: owner });
        console.log('tried and succeed to get vpnHood configuration');
        return new VpnHoodConfigDto(vpnHoodConfiguration.bearerToken,
                                    vpnHoodConfiguration.owner,
                                    vpnHoodConfiguration.projectId,
                                    vpnHoodConfiguration.type,
                                    vpnHoodConfiguration.vpnhoodBaseUrl);
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

