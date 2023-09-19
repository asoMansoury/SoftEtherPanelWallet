import { ConvertCodeToTitle } from "src/lib/utils";

export class UserTestsDTO{
    constructor(email,username,password,type,removedFromServer,agentCode,servertitle,expires){
        this.email = email;
        this.username=username;
        this.password = password;
        this.type = type;
        this.removedFromServer = removedFromServer;
        this.agentCode = agentCode;
        this.expires= expires;
        this.typeTitle = ConvertCodeToTitle(type);
        this.servertitle = servertitle;
    }
}