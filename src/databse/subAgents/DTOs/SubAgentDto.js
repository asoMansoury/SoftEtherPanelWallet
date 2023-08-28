export class SubAgentDto{
    constructor(name,agentcode,agentprefix,introducerEmail,introducerAgentCode,email){
        this.name = name;
        this.agentcode = agentcode;
        this.agentprefix = agentprefix;
        this.introducerEmail = introducerEmail;
        this.introducerAgentCode = introducerAgentCode;
        this.email = email;
    }
}