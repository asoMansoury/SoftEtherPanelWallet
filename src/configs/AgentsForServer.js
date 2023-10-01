const agentEmails = [{
    email:"aso.mansoury@gmail.com"
},{
    email:"mansouri.shasta@gmail.com"
},{
    email:"mohsenmansouri.MM@gmail.com"
},{
    email:"Akradif@gmail.com",
}]

export function GetAgentForServerAdmin(email){
    var result = {
        isValid:false,
    }
    var agent = agentEmails.filter(z=>z.email==email);
    if(agent!=null){
        result.isValid=true;
    }
    return result;
}