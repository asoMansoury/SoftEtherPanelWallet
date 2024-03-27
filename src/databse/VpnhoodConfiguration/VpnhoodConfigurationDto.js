export class VpnHoodConfigDto{
    constructor(bearerToken,owner,projectId,type,vpnhoodBaseUrl){
        this.bearerToken = bearerToken;
        this.owner = owner;
        this.projectId = projectId;
        this.type = type;
        this.vpnhoodBaseUrl = vpnhoodBaseUrl;
    }
}