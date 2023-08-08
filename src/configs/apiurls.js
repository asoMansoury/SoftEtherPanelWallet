import { LOCAL_URL } from "src/lib/utils";

export const apiUrls = {
    "types":{
        "Cisco": "OC1",
        "SoftEther":"SF1"
    },
    "localUrl":{
        "getTariffsUrl": `/api/tariff/getatariff/?type=`,
        "getTariffPlanUrl":`/api/tariff/getatariffplans/?type=`,
        "getAgentTariffPlanUrl":`/api/tariff/getagentatariffplans/?name=`,
        "getTariffPriceUrl":`/api/tariff/gettariffprice/?type=`,
        "calculateTotalPrice":`/api/tariff/calculatetotalpriceapi/`

    },
    "agentUrl":{
        "getAgentInformation":`/api/agents/getagent/?name=`,
        "isAgentUrl":`/api/agents/isagent/?name=`,
        "getAgentBill":'/api/agents/getAgentBill/'
    },
    "userUrl":{
        "createNewUserUrl":`/api/user/createnewuser/`,
        "insertuserbasketUrl":`/api/user/insertuserbasketapi/`,
        "getusersbasket":`/api/user/getuserbasket/?uuid=`,
        "getpurchasedUrl":`/api/user/getpurchasedaccounts/?email=`,
        "senToEmailUrl":`/api/user/senaccounttoemail/?email=`,
        "getUserInformationUrl":`/api/user/getUserInformation/?username=`,
        "getUserInformationByEmail":`/api/user/getUserInformationByEmail/?email=`,
        "changeUserServerUrl":`/api/user/changeuserserver/`,
        "createNewCiscoUserUrl":`/api/user/createnewusercisco/`,
        "calculateUserForRevokeRul":`/api/user/calculateUserForRevoke`,
        "revokeuserUrl":`/api/user/Cisco/revokeuser`,
        "calculateRevokeUserUrl":`/api/user/Cisco/revokeprice`,
    },
    "redisUrl":{
        "setRedisApi":`/api/redis/setredis/`,
        "getRedisApi":`/api/redis/getredis/`
    },
    "server": {
        "getServersApi":`/api/server/getservers`,
        "changeServerApi":`/api/server/changeserver`,
        "getUsersServerApi":`/api/server/getuserserver?username=`
    },
    "customerUrls": {
        "getCustomersApi":`/api/customer/getcustomer`,
        "loginCustomerApi":`/api/user/login`,
        "checkCustomerExistsApi":`/api/customer/checkuserexists`,
        "createcustomerApi":`/api/customer/createcustomer`
    },
    "softwareUrls":{
        "getLinksApi":"/api/software/getdownloadlinks"
    },

    "testAccountsUrls":{
        "gettestaccount":"/api/testaccounts/gettest/?email=",
        "isvalid":"/api/testaccounts/isvalid/?email="
    },
    "UserBasketUrls":{
        "getUserBasketByUserNameApi":`/api/userbasket/getUserBasketByUserName/?username=`,
        "insertusersbasketForRevokingApi":`/api/userbasket/insertusersbasketForRevoking`
    },
    "AdminManagementUrls":{
        "DeleteExpiresUsersApi":`/api/admin/deleteexpiredaccount`,
        "GetAgentInvoice":`/api/admin/getAgentInvoice/?username=`,
        "InvoiceWithAgent":`/api/admin/InvoiceWithAgent/?agentCode=`
    },
    "TutorialUrls":{
        "GetTutorial":`/api/tutorial/gettutorial`
    }
}