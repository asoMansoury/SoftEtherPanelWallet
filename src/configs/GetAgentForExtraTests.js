const agentEmails = [{
    email:"aso.mansoury@gmail.com"
},{
    email:"mansouri.shasta@gmail.com"
},{
    email:"mohsenmansouri.MM@gmail.com"
},{
    email:"Pishgamserver@gmail.com"
},{
    email:"iranfrp85@gmail.com"
}]

export function GetAgentForExtraTests(email){
    var result = {
        isValid:false,
    }
    var agent = agentEmails.filter(z=>z.email==email)[0];
    if(agent!=null){
        result.isValid=true;
    }
    return result;
}