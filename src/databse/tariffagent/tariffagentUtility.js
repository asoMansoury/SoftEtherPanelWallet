export function CalculateTotalPrice(clientSelectedPlans,tariffPlans,agentInformation) {
    var totalPrice = 0;
    console.log(clientSelectedPlans,tariffPlans);

    var i =0;
    for(var item in clientSelectedPlans){
        var findedItem = tariffPlans.find(e=>e.tarrifcode==clientSelectedPlans[i].tariffCode
                                            && e.tariffplancode == clientSelectedPlans[i].tariffplancode);
         i++;                                 
    }
    
    return {
        totalPrice:totalPrice,
        agentCode:'nobody',
        selectedPlanse:clientSelectedPlans
    }
}