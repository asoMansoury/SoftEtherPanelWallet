export class WalletDto{
    constructor(email,isAgent,cashAmount,debitAmount,debitToAgent,agentcode){
        this.email = email;
        this.isAgent = isAgent;
        this.cashAmount = cashAmount;
        this.debitAmount = debitAmount;
        this.debitToAgent = debitToAgent;
        this.agentcode = agentcode;
    }
}