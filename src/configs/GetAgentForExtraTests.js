const agentEmails = [{
    email:"aso.mansoury@gmail.com"
},{
    email:"mansouri.shasta@gmail.com"
},{
    email:"mohsenmansouri.MM@gmail.com"
}]

export function GetAgentForExtraTests(email){
    var result = {
        isValid:false,
    }
    var emailStr = email.toString().trim().toLocaleLowerCase();
    console.log(emailStr)
    var agent = agentEmails.filter(z=>z.email.trim().toLocaleLowerCase()==emailStr)[0];
    if(agent!=null){
        result.isValid=true;
    }
    return result;
}