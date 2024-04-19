import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI, formatDate } from 'src/lib/utils';
import { apiUrls } from 'src/configs/apiurls';
import GetServers from '../server/getservers';
import { DeleteUserCisco } from 'src/lib/Cisco/deleteuser';
import { CreateUserOnCisco } from 'src/lib/Cisco/createuser';
import { RemoveUserOpenVpn } from 'src/lib/OpenVpn/RemoveUserOpenVpn';
import { CreateUserOnOpenVpn } from 'src/lib/OpenVpn/CreateUserOpenVpn';
import { GetWalletUserByCode } from '../Wallet/getWalletUser';
import {  CalculateTotalPriceModifed } from '../tariffagent/calculateTotalPrice';
import { getAgentTariff } from '../tariffagent/getAgentTariff';
import {  IncreaseWalletV2 } from '../Wallet/IncreaseWallet';
import { TransferedWalletLog } from '../Wallet/CreateWallet';
import { GetAgentByAgentCode } from '../agent/getagentinformation';
import { GetCustomerAgentCode } from '../customers/getcustomer';
import { CreateNewUserVpnhood, DeleteVpnhoodUserAccount } from 'src/lib/Vpnhood/CreateNewUserVpnhood';
import { GetVpnHoodConfiguration } from '../VpnhoodConfiguration/getVpnHoodConfiguration';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


function IsValidateForActivatingUser(token, user) {
    if (token.isAgent == true && token.isSubAgent == false) {
        if (user.removedByAdmin == true) {
            return {
                isValid: false,
                errorMsg: "شما دسترسی انجام عملیات مورد نظر را ندارید."
            }
        }
    } else if (token.isAgent == true && token.isSubAgent == true) {
        if (user.removedByAdmin == true || user.removedByAgent == true) {
            return {
                isValid: false,
                errorMsg: "شما دسترسی انجام عملیات مورد نظر را ندارید."
            }
        }
    } else if (token.isAgent == false && token.isSubAgent == false) {
        return {
            isValid: false,
            errorMsg: "شما دسترسی انجام عملیات مورد نظر را ندارید."
        }
    }
    return {
        isValid: true,
        errorMsg: ""
    }
}

export async function DeleteUserOfAgent(email, agentcode, username, token) {
    const today = formatDate(new Date());
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');
        const allExpiredUsers = await collection.find({
            username: username,
            agentcode: agentcode,
            expires: { $gt: today }
        }).toArray();
        var CiscoServers = await GetServers(apiUrls.types.Cisco);
        var SoftEtherServers = await GetServers(apiUrls.types.SoftEther);
        var OpenVpnServers = await GetServers(apiUrls.types.OpenVpn);
        var VpnHoodServers = await GetServers(apiUrls.types.VpnHood);
        for (const user of allExpiredUsers) {
            if (user.removedFromServer == false) {
                user.removedByAgent = token.isAgent == true && token.isSubAgent == false ? true : false;
                user.removedBySubAgent = token.isSubAgent == true ? true : false;
                user.removedByAdmin = token.isAdmin == true ? true : false;
                if (user.type === apiUrls.types.Cisco) {
                    var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
                    DeleteUserCisco(selectedServer, user.username);
                    user.removedFromServer = true;

                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    //emailForDisconnectedUsers(user.email, "دلیل قطع شدن اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);
                } else if (user.type === apiUrls.types.SoftEther) {
                    var selectedSoftEtherServer = SoftEtherServers.filter(server => server.servercode == user.currentservercode)[0];
                    user.removedFromServer = true;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    DeleteUserCisco(selectedSoftEtherServer, user.username);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    //emailForDisconnectedUsers(user.email, "دلیل قطع شدن اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);

                } else if (user.type === apiUrls.types.OpenVpn) {
                    var selectedOpenVpnServer = OpenVpnServers.filter(server => server.servercode == user.currentservercode)[0];
                    user.removedFromServer = true;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    RemoveUserOpenVpn(selectedOpenVpnServer, user);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    //emailForDisconnectedUsers(user.email, "دلیل قطع شدن اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);
                }
                if (user.type === apiUrls.types.VpnHood) {
                    var vpnHoodConfiguration = await GetVpnHoodConfiguration(apiUrls.vpnhoodTypes.All);
                    var selectedServer = VpnHoodServers.filter(server => server.servercode == user.currentservercode)[0];
                    DeleteVpnhoodUserAccount(selectedServer,user.password,vpnHoodConfiguration.bearerToken,vpnHoodConfiguration.vpnhoodBaseUrl)
                    user.removedFromServer = true;

                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    //emailForDisconnectedUsers(user.email, "دلیل قطع شدن اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);
                }

            } else {
                if (token.isAdmin == false) {
                    var validation = IsValidateForActivatingUser(token, user);
                    if (validation.isValid == false) {
                        return validation;
                    }
                }
                user.removedByAgent = false;
                user.removedByAdmin = false;
                user.removedBySubAgent = false;
                if (user.type === apiUrls.types.Cisco) {
                    var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
                    CreateUserOnCisco(selectedServer, user.username, user.password, user.expires);
                    user.removedFromServer = false;

                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    //emailForReconnectingUsers(user.email, "فعال شدن مجدد اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);
                } else if (user.type === apiUrls.types.SoftEther) {
                    var selectedSoftEtherServer = SoftEtherServers.filter(server => server.servercode == user.currentservercode)[0];
                    user.removedFromServer = false;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    CreateUserOnCisco(selectedSoftEtherServer, user.username, user.password, user.expires);
                    //CreateUserOnSoftEther(selectedSoftEtherServer, user, user.policy, user.expires);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    //emailForReconnectingUsers(user.email, "فعال شدن مجدد اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);
                } else if (user.type === apiUrls.types.OpenVpn) {
                    var selectedOpenVpnServer = OpenVpnServers.filter(server => server.servercode == user.currentservercode)[0];
                    user.removedFromServer = false;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    CreateUserOnOpenVpn(selectedOpenVpnServer, user, user.expires);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    //emailForReconnectingUsers(user.email, "فعال شدن مجدد اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);
                }else if(user.type=== apiUrls.types.VpnHood){
                    var vpnHoodConfiguration = await GetVpnHoodConfiguration(apiUrls.vpnhoodTypes.All);
                    var selectedServer = VpnHoodServers.filter(server => server.servercode == user.currentservercode)[0];
                    var token =await CreateNewUserVpnhood(selectedServer,
                                                    user.expires,
                                                    user.username,
                                                    vpnHoodConfiguration.bearerToken,
                                                    vpnHoodConfiguration.vpnhoodBaseUrl);
                    user.password= token.accessTokenId;
                    user.removedFromServer = false;

                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                }

            }

        }

        return allExpiredUsers;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}


export async function DeleteUserOfByClient(username) {
    const today = formatDate(new Date());
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');
        const allExpiredUsers = await collection.find({
            username: username,
            expires: { $gt: today }
        }).toArray();

        var CiscoServers = await GetServers(apiUrls.types.Cisco);
        var SoftEtherServers = await GetServers(apiUrls.types.SoftEther);
        var OpenVpnServers = await GetServers(apiUrls.types.OpenVpn);
        for (const user of allExpiredUsers) {
            if (user.removedFromServer == false) {
                if (user.type === apiUrls.types.Cisco) {
                    var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
                    DeleteUserCisco(selectedServer, user.username);
                    user.removedFromServer = true;

                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                } else if (user.type === apiUrls.types.SoftEther) {
                    var selectedSoftEtherServer = SoftEtherServers.filter(server => server.servercode == user.servercode)[0];
                    user.removedFromServer = true;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    DeleteUserCisco(selectedSoftEtherServer, user.username);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                }else if (user.type === apiUrls.types.OpenVpn) {
                    var selectedOpenVPNServer = OpenVpnServers.filter(server => server.servercode == user.servercode)[0];
                    user.removedFromServer = true;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    RemoveUserOpenVpn(selectedOpenVPNServer, user);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                }

            } else {
                if (user.type === apiUrls.types.Cisco) {
                    var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
                    CreateUserOnCisco(selectedServer, user.username, user.password, user.expires);
                    user.removedFromServer = false;

                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                } else if (user.type === apiUrls.types.SoftEther) {
                    var selectedSoftEtherServer = SoftEtherServers.filter(server => server.servercode == user.currentservercode)[0];
                    user.removedFromServer = false;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    //CreateUserOnSoftEther(selectedServer, user, user.policy, user.expires);
                    CreateUserOnCisco(selectedSoftEtherServer, user.username, user.password, user.expires);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                }else if (user.type === apiUrls.types.OpenVpn) {
                    var selectedOpenVPNServer = OpenVpnServers.filter(server => server.servercode == user.currentservercode)[0];
                    user.removedFromServer = false;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    //CreateUserOnSoftEther(selectedServer, user, user.policy, user.expires);
                    CreateUserOnOpenVpn(selectedOpenVPNServer,user);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                }

            }

        }

        return allExpiredUsers;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}


export async function DeleteUserByAdmin(username) {
    const today = formatDate(new Date());
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');
        const user = await collection.findOne({
            username: username,
            expires: { $gt: today }
        });
        user.removedByAgent =  false;
        user.removedBySubAgent =  false;
        user.removedByAdmin =  true ;


        var agentInfo = await GetCustomerAgentCode(user.agentcode);
        if(agentInfo.isvalid==true){
            var agent = await GetWalletUserByCode(user.agentcode);
            var plans = (await getAgentTariff(user.agentcode)).filter((z=>z.tariffplancode==user.tariffplancode&&
                                                                          z.tarrifcode==user.policy &&
                                                                          z.type==user.type));
    
            var calculateTotalPrice = await CalculateTotalPriceModifed(user.agentcode,plans,user.type);
    
            await IncreaseWalletV2(agentInfo.email,calculateTotalPrice.ownerPrice).then((response=>{
                if(response.isValid==true)
                    TransferedWalletLog("aso.mansoury@gmail.com",user.agentcode,agent.email,calculateTotalPrice.ownerPrice,`برگشت مبلغ ${calculateTotalPrice.ownerPrice} به اکانت بابت لغو اکانت ${user.username}`);
                else
                    TransferedWalletLog("aso.mansoury@gmail.com",user.agentcode,agent.email,calculateTotalPrice.ownerPrice,`عدم موفقیت در برگشت مبلغ ${calculateTotalPrice.ownerPrice} به اکانت بابت لغو اکانت ${user.username}`);
            }));
      
            const filter = { _id: user._id };
            const updateOperation = { $set: user };
            await collection.updateOne(filter, updateOperation);
    
    
            if (user.type === apiUrls.types.Cisco) {
                var CiscoServers = await GetServers(apiUrls.types.Cisco);
                var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
                DeleteUserCisco(selectedServer, user.username);
            } else if (user.type === apiUrls.types.SoftEther) {
                var SoftEtherServers = await GetServers(apiUrls.types.SoftEther);
                var selectedSoftEtherServer = SoftEtherServers.filter(server => server.servercode == user.servercode)[0];
                //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                RemoveUserOpenVpn(selectedSoftEtherServer, user);
            } else if (user.type === apiUrls.types.OpenVpn) {
                var OpenVpnServers = await GetServers(apiUrls.types.OpenVpn);
                var selectedOpenVpnServer = OpenVpnServers.filter(server => server.servercode == user.currentservercode)[0];
                RemoveUserOpenVpn(selectedOpenVpnServer, user);
            }else if(user.type== apiUrls.types.VpnHood){
                var VpnHoodServers = await GetServers(apiUrls.types.OpenVpn);
                var selectedVpnHoodServer = VpnHoodServers.filter(server => server.servercode == user.currentservercode)[0];
                var vpnHoodConfiguration = await GetVpnHoodConfiguration(apiUrls.vpnhoodTypes.All);
                DeleteVpnhoodUserAccount(selectedVpnHoodServer,user.password,vpnHoodConfiguration.bearerToken,vpnHoodConfiguration.vpnhoodBaseUrl);
            }
        }


        return [];
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }





}





export default DeleteUserOfAgent;