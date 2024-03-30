import { fetchVpnHoodApi } from "./VpnHoodApi";

export const CreateNewUserVpnhood = async (selectedServer, expirationTime,userName,bearerToken,vpnhoodBaseUrl) =>{
    const parts = expirationTime.split(/[\/ :]/); // Split based on "/", " ", and ":"
    const convertedDate = `${parts[0]}-${parts[1]}-${parts[2]}T${parts[3]}:${parts[4]}:${parts[5]}`;    
    // var convertedDate = expirationTime;//'2024/04/29 14:58:23' => "2024-03-23T22:58:30"
    var projectId = selectedServer.password;
    var serverFarmId = selectedServer.host;

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

export const GetAccessTokenVpnHood = async (selectedServer, createdToken,bearerToken,vpnhoodBaseUrl) =>{  
    // var convertedDate = expirationTime;//'2024/04/29 14:58:23' => "2024-03-23T22:58:30"
    var projectId = selectedServer.password;
    var serverFarmId = selectedServer.host;
    var generatedUrl = `${vpnhoodBaseUrl}projects/${projectId}/access-tokens/${createdToken.accessTokenId}/access-key`;
    console.log({ generatedUrl})
    var token =await fetchVpnHoodApi(generatedUrl, 'GET',null,bearerToken);
    console.log({token})
    return token;
}