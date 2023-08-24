const { TariffAgentDto } = require("../DTOs/tariffagentDto");

export function tariffAgentWrapper(plans=[],agentcode){
    console.log({plans});
    var result = [];
    var tmp  = [];
    tmp = plans;
    tmp.foreach((item)=>{
        const tariffItem = new TariffAgentDto(agentcode,item.tariffcode,
                                                item.price,item.agentprice,item.tariffplancode,item.type);
        result.push(tariffItem);
    });
    return tmp;
}