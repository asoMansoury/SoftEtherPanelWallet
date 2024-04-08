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
        isPublic: false
    };
    
    var createUrl = `${vpnhoodBaseUrl}projects/${projectId}/access-tokens`;

    var result =await  fetchVpnHoodApi(createUrl, 'POST', createTokenDto,bearerToken);
    return result;
}

export const UpdateUserVpnHood = async (selectedServer,expirationTime,userName,user,bearerToken,vpnhoodBaseUrl)=>{
    const parts = expirationTime.split(/[\/ :]/); // Split based on "/", " ", and ":"
    const convertedDate = `${parts[0]}-${parts[1]}-${parts[2]}T${parts[3]}:${parts[4]}:${parts[5]}`;   
    // var convertedDate = expirationTime;//'2024/04/29 14:58:23' => "2024-03-23T22:58:30"
    var projectId = selectedServer.password;
    var serverFarmId = selectedServer.host;

     const updatedToken = {
        expirationTime: {
            value: convertedDate.toString()
          },
          isEnabled: {
            value: true
          }
    };
    var createUrl = `${vpnhoodBaseUrl}projects/${projectId}/access-tokens/${user.accessTokenId}`;
    var result =await  fetchVpnHoodApi(createUrl, 'PATCH', updatedToken,bearerToken);
    return result;
}

export const GetAccessTokenVpnHood = async (selectedServer, createdToken,bearerToken,vpnhoodBaseUrl) =>{  
    // var convertedDate = expirationTime;//'2024/04/29 14:58:23' => "2024-03-23T22:58:30"
    var projectId = selectedServer.password;
    var serverFarmId = selectedServer.host;
    var generatedUrl = `${vpnhoodBaseUrl}projects/${projectId}/access-tokens/${createdToken.accessTokenId}/access-key`;
    var token =await fetchVpnHoodApi(generatedUrl, 'GET',null,bearerToken);
    return token;
}


export const DeleteVpnhoodUserAccount = async (selectedServer, accessTokenId,bearerToken,vpnhoodBaseUrl) =>{  
    // var convertedDate = expirationTime;//'2024/04/29 14:58:23' => "2024-03-23T22:58:30"
    var projectId = selectedServer.password;
    var serverFarmId = selectedServer.host;
    var generatedUrl = `${vpnhoodBaseUrl}projects/${projectId}/access-tokens/${accessTokenId}`;
    await fetchVpnHoodApi(generatedUrl, 'DELETE',null,bearerToken);
}


export const RestartVpnhoodUserAccount = async (selectedServer, user,bearerToken,vpnhoodBaseUrl) =>{ 
    const checkObject = {
        TypeName: "NotExistsException",
        TypeFullName: "VpnHood.Common.Exceptions.NotExistsException",
        Message: "Sequence contains no elements."
    };
    

    // var convertedDate = expirationTime;//'2024/04/29 14:58:23' => "2024-03-23T22:58:30";
    var projectId = selectedServer.password;
    var serverFarmId = selectedServer.host;
    var createdToken = {
        accessTokenId:user.currenthubname
    };
    
    var generatedToken =await GetAccessTokenVpnHood(selectedServer,createdToken,bearerToken,vpnhoodBaseUrl);
    var result = {
        existed:true,
        generatedToken:"",
        accessTokenId:""
    }
    if(generatedToken.TypeName==undefined){
        result.generatedToken =generatedToken;
        result.accessTokenId = createdToken.accessTokenId;
    }else{
        var createNewToken = await CreateNewUserVpnhood(selectedServer,
                                                        user.expires,
                                                        user.username,
                                                        bearerToken,
                                                        vpnhoodBaseUrl);
        var newGeneratedToken =await GetAccessTokenVpnHood(selectedServer,createNewToken,bearerToken,vpnhoodBaseUrl);
        result.accessTokenId = createNewToken.accessTokenId;
        result.existed = false;
        result.generatedToken = newGeneratedToken;
    }
    return result;
}


export const RevokeVpnhoodUserAccount = async (selectedServer, user,bearerToken,vpnhoodBaseUrl) =>{ 
    const checkObject = {
        TypeName: "NotExistsException",
        TypeFullName: "VpnHood.Common.Exceptions.NotExistsException",
        Message: "Sequence contains no elements."
    };
    

    // var convertedDate = expirationTime;//'2024/04/29 14:58:23' => "2024-03-23T22:58:30";
    user.accessTokenId =user.currenthubname;


    
    var generatedToken =await GetAccessTokenVpnHood(selectedServer,user,bearerToken,vpnhoodBaseUrl);
    var result = {
        existed:true,
        generatedToken:"",
        accessTokenId:""
    }
    if(generatedToken.TypeName==undefined){
        var updatedResult = await UpdateUserVpnHood(selectedServer,
                                                    user.expires,
                                                    user.username,
                                                    user,
                                                    bearerToken,vpnhoodBaseUrl)
        result.generatedToken =generatedToken;
        result.accessTokenId = user.accessTokenId;
    }else{
        var createNewToken = await CreateNewUserVpnhood(selectedServer,
                                                        user.expires,
                                                        user.username,
                                                        bearerToken,
                                                        vpnhoodBaseUrl);
        var newGeneratedToken =await GetAccessTokenVpnHood(selectedServer,createNewToken,bearerToken,vpnhoodBaseUrl);
        result.accessTokenId = createNewToken.accessTokenId;
        result.existed = false;
        result.generatedToken = newGeneratedToken;
    }
    return result;
}

