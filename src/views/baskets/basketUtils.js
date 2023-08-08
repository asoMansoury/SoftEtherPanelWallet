

export function ConvertPriceFromAgentFormat(agentInformation,tariffPlans,tariffCode){
    var tmpData = [];
    var i=0;
    for(var item in agentInformation.agentTariffs){

        agentInformation.agentTariffs[i].oldPrice = agentInformation.agentTariffs[i].price;
        agentInformation.agentTariffs[i].price = agentInformation.agentTariffs[i].agentprice;
        tmpData.push(agentInformation.agentTariffs[i]);
        i++;

    }

    return tmpData;
}


export function ConvertMonthFromAgentFormat(agentInformation,tariffPlans,tariffCode){
    var tmpData = [];
    var i=0;
    for(var item in tariffPlans){
        let result = agentInformation.agentTariffs.find(e=>e.tarrifcode==tariffCode && e.tariffplancode==tariffPlans[i].code);
        if(result!==undefined){
            tmpData.push(tariffPlans[i]);
            i++;
        }
    }
    
    return tmpData;
}
