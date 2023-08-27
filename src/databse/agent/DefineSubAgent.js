import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { ValidationDto } from '../CommonDto/ValidationDto';

import { ValidationForInputs, ValidationForPlans, ValidationForWallet } from './agentUtils';
import { GetCustomerAgentCode, GetCustomerAgentCodeIgnoreCase, GetCustomerByEmail } from '../customers/getcustomer';
import { GetAgentByAgentPrefix } from './GetAgentByAgentPrefix';
import { WrapperCustomer } from '../customers/customerUtils';
import { RegisterAgentCustomers, RegisterAgentCustomersByOtherAgents } from '../customers/registercustomers';
import { CreateNewWallet, CreateNewWalletForAgent, TransferedWalletLog } from '../Wallet/CreateWallet';
import { TransferMoneyToOtherWallet } from '../Wallet/UpdateWallet';
import { CreateNewAgent, CreateNewAgentByAgents } from './CreateNewAgent';
import { DefineNewTariffAgent } from '../tariffagent/DefineNewTariffAgent';
import { GetWalletUser } from '../Wallet/getWalletUser';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function ValidationForAgent(agent) {
    const connectionState = await client.connect();
    const db = client.db('SoftEther');



    const collectionAgent = db.collection('Agents');
    const loadCustomerByEmail = await GetCustomerByEmail(agent.email);

    if (loadCustomerByEmail.isvalid == true)
        return new ValidationDto(false, "ایجنت برای این ایمیل قبلا تعریف شده است.");

    const customerDoc = await GetCustomerAgentCodeIgnoreCase(agent.agentcode);
    if (customerDoc.isvalid == true)
        return new ValidationDto(false, `کد ایجنت << ${agent.agentcode} >> قبلا تعریف شده است. لطفا این کدرا تغییر دهید.`);

    const agentPrefixIsExist = await GetAgentByAgentPrefix(agent.agentprefix);
    if (agentPrefixIsExist.isAgentValid == true)
        return new ValidationDto(false, `کد پشوند کاربر << ${agent.agentprefix} >> قبلا تعریف شده است. لطفا این کدرا تغییر دهید.`);
    return new ValidationDto(true, "")
}



async function ValidationInputs(agent, plans,token) {
    var resultValidationForNonAsync = ValidationForInputs(agent);
    if (resultValidationForNonAsync.isValid == false)
        return resultValidation;

    var resultValidationForNonAsync = ValidationForWallet(agent,token.email);
    if (resultValidationForNonAsync.isValid == false)
        return resultValidation;

    var resultValidationAsync = await ValidationForAgent(agent);
    if (resultValidationAsync.isValid == false)
        return resultValidationAsync;

    resultValidationAsync = await ValidationForPlans(plans)
    if (resultValidationAsync.isValid == false)
        return resultValidation;

    return new ValidationDto(true, "");

}
export async function DefineSubAgent(agent, plans, token) {
    const ValidateValue = await ValidationInputs(agent, plans,token);
    if (ValidateValue.isValid == false)
        return ValidateValue;

    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');

        const { email, password, agentcode, cashAmount, agentprefix, name } = agent;

        var user = WrapperCustomer(email, password, agentcode);
        var resultRegisterCustomer = await RegisterAgentCustomersByOtherAgents(user, token.email, true);
        var resultCreateNewWallet = await CreateNewWalletForAgent(email, true, cashAmount, 0, 0, agentcode);
        var resultCreateNewAgent = await CreateNewAgentByAgents(name, "6221061221256532", 20, agentcode, agentcode, 20000, agentprefix, token.email, token.agentcode, true);
        var resultDefineNewTariffAgent = await DefineNewTariffAgent(plans, agentcode);
        TransferMoneyToOtherWallet(token.email, "", cashAmount);
        TransferedWalletLog(token.email, token.agentcode, email, cashAmount);

        return { isValid: true };
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}


