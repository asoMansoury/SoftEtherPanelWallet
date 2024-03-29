import { fetchVpnHoodApi } from "./VpnHoodApi";
const vpnhoodBaseUrl = 'https://api.vpnhood.com/api/v1/';

export const CreateNewUserVpnhood = async (selectedServer, expirationTime,userName,bearerToken,vpnhoodBaseUrl) =>{

    var convertedDate = expirationTime;//'2024/04/29 14:58:23' => "2024-03-23T22:58:30"
    var projectId = selectedServer.password;
    var serverFarmId = selectedServer.host;
    console.log(convertedDate); 

     const createTokenDto = {
        serverFarmId: serverFarmId,
        accessTokenName: userName,
        maxTraffic: 0,
        lifetime: 0,
        maxDevice: 1,
        expirationTime:convertedDate,
        url: "string",
        isPublic: true
    };

    var result =  fetchVpnHoodApi(`${vpnhoodBaseUrl}projects/${projectId}/access-tokens`, 'POST', createTokenDto,bearerToken);
    return result;
}