import { MongoClient, ServerApiVersion } from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import { UpdateTank } from 'src/databse/SalesTank/SalesTank';
import { DecreaseWallet, IncreaseWalletV2 } from 'src/databse/Wallet/IncreaseWallet';
import { GetMoneyFromOtherWallet } from 'src/databse/Wallet/UpdateWallet';
import { CheckAgentWalet, GetWalletUser, GetWalletUserByCode } from 'src/databse/Wallet/getWalletUser';
import { GetAgentByUserCode, IsAgentValid } from 'src/databse/agent/getagentinformation';
import { GetCustomerAgentCode, GetCustomerByEmail } from 'src/databse/customers/getcustomer';
import GetServerByCode from 'src/databse/server/getServerByCode';
import GetServers from 'src/databse/server/getservers';
import { getTariffs } from 'src/databse/tariff/getTariff';
import { getTariffPrices } from 'src/databse/tariff/tariffPrice';
import { CalculateTotalPriceModifed } from 'src/databse/tariffagent/calculateTotalPrice';
import { getAgentPlans } from 'src/databse/tariffagent/getAgentPlans';
import { getTarrifPlans } from 'src/databse/tarrifplans/getTarrifPlans';
import { PAID_CUSTOMER_STATUS } from 'src/databse/usersbasket/PaidEnum';
import GetUsersBasketByUUID from 'src/databse/usersbasket/getusersbasket';
import { UpdateUsersBasketForRevoke } from 'src/databse/usersbasket/insertusersbasket';
import { CreateUserOnCisco } from 'src/lib/Cisco/createuser';
import { CreateUserOnOpenVpn } from 'src/lib/OpenVpn/CreateUserOpenVpn';
import { UpdateExpirationTimeSoftEther } from 'src/lib/createuser/UpdateExpirationTime';
import { GenerateOneMonthExpiration, GenerateOneMonthExpirationStartDate, MONGO_URI, calculateEndDate, formatDate } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function RevokeUser(username, tariffplancode, tariffcode, type, uuid, token) {
    try {
        var userCreated = [];
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const userCollection = db.collection('Users');
        var foundedUser = await userCollection.findOne({ username: username });
        if (foundedUser.isfromagent == false) {
            var tariffPrices = await getTariffPrices(type);

            var selectedTarifPlane = tariffPrices.filter((item) => item.tariffplancode == tariffplancode
                && item.tarrifcode == tariffcode)[0];

            var tariffs = await getTariffs(type);
            var selectedTariff = tariffs.filter((item) => item.code == tariffcode)[0];

            var months = await getTarrifPlans(type);
            var selectedPlanType = months.filter((item) => item.code == tariffplancode)[0];

        } else if (foundedUser.isfromagent == true) {

            var isAgentValid = await IsAgentValid(token.email);
            var customer = await GetCustomerAgentCode(foundedUser.agentcode);
            var getAgentPricePlans = await getAgentPlans(foundedUser.agentcode, foundedUser.type);
            var agentPlans = getAgentPricePlans.filter((item) => item.tariffplancode == tariffplancode
                && item.tarrifcode == tariffcode);

            var totalPrice = await CalculateTotalPriceModifed(foundedUser.agentcode, agentPlans, foundedUser.type);
            var months = await getTarrifPlans(foundedUser.type);
            var selectedPlanType = months.filter((item) => item.code == tariffplancode)[0];
            //زمانی است که ایجنت لاگین کرده و می خواهد یک مشتری را تمدید کند و در این حالت از کیف پول مشتری کم خواهیم کرد.
            if (isAgentValid.isAgent == true && isAgentValid.isSubAgent != true) {
                var agentWallet = await GetWalletUserByCode(foundedUser.agentcode, foundedUser.type);
                //محاسبه موجود کیف پول ایجنت فروش
                var checkHasCash = agentWallet.cashAmount - totalPrice.ownerPrice;
                if (parseInt(checkHasCash) < 0) {
                    return {
                        isValid: false,
                        message: "موجودی کیف پول شما برای خرید اکانت کافی نمی باشد. لطفا با مدیریت تماس بگیرید."
                    };
                }

                const walletCollection = db.collection('Wallet');
                UpdateTank(type, totalPrice.ownerPrice);
                var result = await walletCollection.updateOne({ email: { $regex: `^${customer.email}$`, $options: "i" } },
                    {
                        $set: {
                            cashAmount: checkHasCash,
                        }
                    })

            }else  if (isAgentValid.isAgent == true && isAgentValid.isSubAgent == true) {
                var agentWallet = await GetWalletUserByCode(foundedUser.agentcode, foundedUser.type);
                //محاسبه موجود کیف پول ایجنت فروش
                var checkHasCash = agentWallet.cashAmount - totalPrice.ownerPrice;
                if (checkHasCash < 0) {
                    return {
                        isValid: false,
                        message: "موجودی کیف پول شما برای خرید اکانت کافی نمی باشد. لطفا با مدیریت تماس بگیرید."
                    };
                }
                var totalPriceParentAgent = await CalculateTotalPriceModifed(isAgentValid.introducerAgentCode, agentPlans, foundedUser.type);
                var differMoney = totalPrice.ownerPrice - totalPriceParentAgent.ownerPrice;
                UpdateTank(type, totalPriceParentAgent.ownerPrice);
                await DecreaseWallet(agentWallet.email, totalPrice.ownerPrice)
                await IncreaseWalletV2(isAgentValid.introducerEmail, differMoney);
            } else {
                //زمانی است که مشتری ما وارد پنل خود شده است و میخواهد اکانت خود را تمدید کنید.
                //ابتدا چک می کنیم که آیا این مشتری کیف پول تعریف شده است یا خیر
                var agentWallet = await GetWalletUserByCode(foundedUser.agentcode, foundedUser.type);//کیف پول مربوط به ایجنت اصلی مشتری عادی
                var isAgentValid = await IsAgentValid(agentWallet.email);
                var customerAgentIsDefined = await CheckAgentWalet(foundedUser.email, foundedUser.type);
                if (customerAgentIsDefined.isValidWallet == false) {
                    return {
                        isValid: false,
                        message: "موجودی کیف پول شما برای خرید اکانت کافی نمی باشد. لطفا با مدیریت تماس بگیرید."
                    };
                }

                //محاسبه موجود کیف پول کاربر عادی 
                var checkHasCash = customerAgentIsDefined.cashAmount - totalPrice.agentPrice;
                if (checkHasCash < 0) {
                    return {
                        isValid: false,
                        message: "موجودی کیف پول شما برای خرید اکانت کافی نمی باشد. لطفا با مدیریت تماس بگیرید."
                    };
                }
                await DecreaseWallet(customerAgentIsDefined.email, totalPrice.agentPrice);//کسر کیف پول از حساب مشتری عادی به میزان تعریف شده برای او

                if (isAgentValid.isAgent == true && isAgentValid.isSubAgent != true) {
                    var differMoney = totalPrice.agentPrice - totalPrice.ownerPrice;//محسابه مابه تفاوت مشتری عادی به ایجنت اصلی
                    await IncreaseWalletV2(agentWallet.email, differMoney);// اضافه کردن به حساب ایجنت اصلی به میزان مابه تفاوت تعریف شده برای او و مشتری زیر مجموعه اش
                    UpdateTank(type, totalPrice.ownerPrice);

                } else if (isAgentValid.isAgent == true && isAgentValid.isSubAgent == true) {
                    var differMoney = totalPrice.agentPrice - totalPrice.ownerPrice;//محسابه مابه تفاوت مشتری عادی به ایجنت اصلی
                    await IncreaseWalletV2(agentWallet.email, differMoney);// اضافه کردن به حساب ایجنت اصلی به میزان مابه تفاوت تعریف شده برای او و مشتری زیر مجموعه اش

                    var totalPriceParentAgent = await CalculateTotalPriceModifed(isAgentValid.introducerAgentCode, agentPlans, foundedUser.type);
                    var differMoneyForParentAgent = totalPrice.ownerPrice - totalPriceParentAgent.ownerPrice;
                    await IncreaseWalletV2(isAgentValid.introducerEmail, differMoneyForParentAgent);

                    UpdateTank(type, totalPriceParentAgent.ownerPrice);
                }
            }
        }

        var updatingUserBasket = UpdateUsersBasketForRevoke(uuid, PAID_CUSTOMER_STATUS.PAID, true);

        const today = new Date();
        var nextExpirationDate =new Date(foundedUser.expires); 
        var isRemovedFromServer= foundedUser.removedFromServer==true?true:false;
        if(today>foundedUser.expires){
            nextExpirationDate = calculateEndDate(formatDate(today), selectedPlanType.duration);
        }else{
            nextExpirationDate = calculateEndDate(foundedUser.expires, selectedPlanType.duration);
            foundedUser.isRevoked = true;
            foundedUser.expires = nextExpirationDate;
            foundedUser.removedFromServer = false;
        }


        await userCollection.updateOne(
            { "username": username }, // Filter condition to match the document
            { $set: { "expires": nextExpirationDate, "isRevoked": true, "uuid": uuid } } // Update operation using $set to set the new value
        )

        if (foundedUser.type == apiUrls.types.SoftEther)
            UpdateSoftEtherUserExpiration(foundedUser, nextExpirationDate);
        UpdateUsersWhichRemovedFromServer(foundedUser,isRemovedFromServer)

        foundedUser.isValid = true;
        return foundedUser;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        //client.close();
    }
}

async function UpdateUsersWhichRemovedFromServer(foundedUser,isRemovedFromServer){
    if(isRemovedFromServer==true){
        if(foundedUser.type == apiUrls.types.OpenVpn){
            var selectedServer =await GetServerByCode(foundedUser.currentservercode);
            CreateUserOnOpenVpn(selectedServer,foundedUser);
        }else if(foundedUser.type == apiUrls.types.Cisco){
            var selectedServer =await GetServerByCode(foundedUser.currentservercode);
            CreateUserOnCisco(selectedServer,foundedUser.username,foundedUser.password);
        }
    }
}

export async function CalculatingForRevoke(username, tariffplancode, tariffcode, type) {
    try {
        var userCreated = [];
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const userCollection = db.collection('Users');

        var foundedUser = await userCollection.findOne({ username: username });

        if (foundedUser.isfromagent == false) {
            var tariffPrices = await getTariffPrices(type);

            var selectedTarifPlane = tariffPrices.filter((item) => item.tariffplancode == tariffplancode
                && item.tarrifcode == tariffcode)[0];

            return {
                isFromAgent: false,
                agentPrice: 0,
                price: selectedTarifPlane.price
            }
        } else {

            var tariffPrices = await getAgentPlans(foundedUser.agentcode, type);

            var selectedTarifPlane = tariffPrices.filter((item) => item.tariffplancode == tariffplancode
                && item.tarrifcode == tariffcode)[0];

            return {
                isFromAgent: true,
                agentPrice: selectedTarifPlane.agentprice,
                price: selectedTarifPlane.price
            };
        }

        return foundedUser;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        //client.close();
    }
}


async function UpdateSoftEtherUserExpiration(foundedUser, nextExpirationDate) {
    var UserServers = await GetServers(apiUrls.types.SoftEther);

    UserServers.map((serverItem, index) => {
        UpdateExpirationTimeSoftEther(serverItem, foundedUser, nextExpirationDate.toString())
    })
}


export default RevokeUser;