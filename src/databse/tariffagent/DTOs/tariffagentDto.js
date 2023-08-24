export class TariffAgentDto{
    constructor(agentcode,tarrifcode,price,agentprice,tariffplancode,type){
        this.agentcode = agentcode;
        this.tarrifcode = tarrifcode;
        this.price = price;
        this.agentprice = agentprice;
        this.tariffplancode = tariffplancode;
        this.type = type;
    }
}