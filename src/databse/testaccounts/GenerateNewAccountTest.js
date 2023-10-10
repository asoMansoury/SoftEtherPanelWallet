import { MongoClient, ServerApiVersion } from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import { sendEmailCiscoClientTest, sendEmailTest } from 'src/lib/emailsender';
import { GenerateTestExpiration, MONGO_URI, formatDate } from 'src/lib/utils';
import { CreateUserOnCisco } from 'src/lib/Cisco/createuser';
import { CreateUserOnSoftEther } from 'src/lib/createuser/createuser';
import GetServerByCode from '../server/getServerByCode';
import { GetAgentByAgentCode } from '../agent/getagentinformation';
import { CreateUserOnOpenVpn } from 'src/lib/OpenVpn/CreateUserOpenVpn';
import { sendOpenVpnEmailTest } from 'src/lib/Emails/OpenVpnEmails/OpenVpnCreated';
import { GetAgentForExtraTests } from 'src/configs/GetAgentForExtraTests';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
function generateRandomPassword(length) {
    let password = '';
    const possibleCharacters = '0123456789';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
        password += possibleCharacters.charAt(randomIndex);
    }

    return password;
}


async function GenerateNewAccount(email, selectedServer, type, agentCode) {
    const connectionState = await client.connect();
    const db = client.db('SoftEther');
    const collection = db.collection('TestAccounts');
    var expireDate = GenerateTestExpiration(1);
    var documents = await collection.find().sort({ _id: -1 }).limit(1).toArray();
    var num = documents[0] != undefined ? documents[0].number + 1 : 101;
    var obj = {
        email: email,
        password: generateRandomPassword(5),
        expires: expireDate,
        servercode: selectedServer.servercode,
        type: type,
        removedFromServer: false,
        username: 'test' + num,
        number: num,
        agentCode: agentCode
    }
    var insert = await collection.insertOne(obj);
    return obj;
}

export async function GenerateNewAccountTest(email, type, currentDomain, servercode, agentCode) {
    if (type == '' || type == undefined)
        type = apiUrls.types.SoftEther;

    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TestAccounts');
        const documents = await collection.findOne({ email: email, type: type, servercode: servercode });
        
        if (documents == null || GetAgentForExtraTests(email).isValid==true) {
            var agent = await GetAgentByAgentCode(agentCode);
            if (agent.isAgentValid == false) {
                agent = await GetAgentByAgentCode(process.env.DefaultAgentCodeForTesting);
                agentCode = process.env.DefaultAgentCodeForTesting.toString();
            }
            var selectedServer = await GetServerByCode(servercode);
            var insertTestAccount = await GenerateNewAccount(email, selectedServer, type, agentCode);

            const selectedUser = await collection.findOne({ email: email, type: type });
            var tmpUsers = [];
            if (type == apiUrls.types.Cisco) {
                selectedUser.username = insertTestAccount.username;
            } else if (type == apiUrls.types.SoftEther) {
                selectedUser.ovpnurl = selectedServer.ovpnurl
            } else if (type == apiUrls.types.OpenVpn) {
                selectedUser.ovpnurl = selectedServer.ovpnurl
            }

            tmpUsers.push(selectedUser);
            if (type == apiUrls.types.Cisco) {
                CreateUserOnCisco(selectedServer, insertTestAccount.username, selectedUser.password);
                var sendingEmailResult = await sendEmailCiscoClientTest(email, tmpUsers, selectedServer, "لطفا پاسخ ندهید(اطلاعات اکانت تستی)", agent);
            } else if (type == apiUrls.types.SoftEther) {
                var customerAccount = {
                    username: insertTestAccount.username,
                    password: selectedUser.password,
                    ovpnurl: selectedServer.ovpnurl
                };
                CreateUserOnSoftEther(selectedServer, customerAccount, "P1", selectedUser.expires);
                var sendingEmailResult = await sendEmailTest(email, tmpUsers, "لطفا پاسخ ندهید(اطلاعات اکانت تستی)", agent)
            } else {
                var customerAccount = {
                    username: insertTestAccount.username,
                    password: selectedUser.password,
                    ovpnurl: selectedServer.ovpnurl
                };
                CreateUserOnOpenVpn(selectedServer, customerAccount, selectedUser.expires);
                var sendingEmailResult = await sendOpenVpnEmailTest(email, tmpUsers, "لطفا پاسخ ندهید(اطلاعات اکانت تستی)", agent)
            }

            return {
                isValid: true,
                message: 'اکانت تست به ایمیل شما ارسال گردید.'
            };
        }



        return {
            isValid: false,
            message: `برای ایمیل ${email} قبلا اکانت تستی صادر شده است.`
        }


    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}

export async function IsValidForCreatingNewTestAccount(email, type, servercode) {
    if (type == '' || type == undefined)
        type = apiUrls.types.Cisco;
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TestAccounts');

        if (GetAgentForExtraTests(email).isValid == true) {
            return {
                isValid: true,
                message: ``
            };
        }
        if (type == apiUrls.types.SoftEther) {
            const documents = await collection.findOne({ email: { $regex: `^${email}$`, $options: "i" }, type: type });
            if (documents != null)
                return {
                    isValid: false,
                    message: `برای ایمیل ${email} قبلا اکانت تستی صادر شده است.`
                }

            return {
                isValid: true,
                message: ``
            };
        } else {
            const documents = await collection.findOne({ email: { $regex: `^${email}$`, $options: "i" }, type: type, servercode: servercode });
            if (documents != null)
                return {
                    isValid: false,
                    message: `برای ایمیل ${email} قبلا اکانت تستی صادر شده است.`
                }

            return {
                isValid: true,
                message: ``
            };
        }

    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}


