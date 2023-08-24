import { WalletDto } from "../DTOs/WalletDto";

export default function WalletDocToDTo(doc){
    var Dto = new WalletDto(doc.email,doc.isAgent,doc.cashAmount,doc.debitAmount,doc.debitToAgent,doc.agentcode);
    return Dto;
}