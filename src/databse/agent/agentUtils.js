import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools";
import { ValidationDto } from "../CommonDto/ValidationDto";
import { isEmail } from 'validator';
import { GetWalletUser } from "../Wallet/getWalletUser";

export async function ValidationForInputs(agent) {
    if (agent.email || agent.cashAmount == 0 || agent.password || agent.agentcode == ""
        || agent.agentprefix == "" || agent.name == "")
        return new ValidationDto(true, "اطلاعات وارد شده کامل نمی باشد.")

    if (!isEmail(agent.email))
        return new ValidationDto(false, "فرمت ایمیل صحیح نمی باشد. ");

    if (agent.agentcode.length < 3)
        return new ValidationDto(true, "تعداد کاراکتر کد ایجینت باید بزرگتر از 3 باشد")

    if (agent.agentcode.length < 2)
        return new ValidationDto(true, "تعداد کاراکتر پیشوند باید بزرگتر از 2 کاراکتر باشد")

    return new ValidationDto(true, "")
}


export async function ValidationForPlans(plans) {
    var result = true;
    plans.forEach((item, index) => {
        if (parseInt(item.price) < parseInt(item.ownerPrice)) {
            result = false;
            return;
        }
    })
    if (result == false)
        return new ValidationDto(false, `قیمت  فروش شما به نماینده فروش برای اکانت << ${item.tarrifTitle} >> و نوع اکانت << ${item.typeTitle} >> نباید از قیمت فروش به شما کمتر باشد. حداقل قیمت می بایست بزرگتر یا برابر با <<${addCommas(digitsEnToFa(item.ownerPrice))}>>. ردیف شماره ${digitsEnToFa(index + 1)} چک گردد.`,)

    return new ValidationDto(true, "")
}


export async function ValidationForWallet(agent, senderEmail) {
    var UserWallet = await GetWalletUser(senderEmail);
    if (UserWallet.cashAmount < agent.cashAmount)
        return new ValidationDto(false, "موجودی حساب شما کمتر از مبلغ انتقالی می باشد.");
    return new ValidationDto(true, "")
}