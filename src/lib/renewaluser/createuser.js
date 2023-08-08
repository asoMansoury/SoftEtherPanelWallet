export const RenewalUserOnSoftEther = async (config,createdUser,groupPolicy,expireDate)=>{
    var serverConfig = {
        host:         config.host,
        userName:     config.username,
        password:   config.password,
        port: config.port
      }
    var Vpncmd = `/opt/softether/vpncmd -SERVER 127.0.0.1 -PASSWORD:${config.vpncmdpassword}`
    var HubName = `Hub ${config.HubName}`;
    var CreateUser = `UserCreate ${createdUser.username} /GROUP:${groupPolicy}  /REALNAME:"" /NOTE:""`;
    var UserPasswordSet = `UserPasswordSet ${createdUser.username} /PASSWORD:${createdUser.password}`;
    var UserExpiresSet = `UserExpiresSet ${createdUser.username} /EXPIRES:"${expireDate.toString()}"`;
    
    var host = {
        server:  serverConfig,
        commands:      [
         "`This is a message that will be added to the full sessionText`",
         "msg:This is a message that will be displayed during the process",
         Vpncmd,
         HubName,
         CreateUser,
         UserPasswordSet,
         UserExpiresSet
        ],
        onCommandComplete:   function( command, response, sshObj) {
            //handle just one command or do it for all of the each time
            console.log("command completed with response" , response)
        },
        onCommandProcessing: function (command, response, sshObj, stream){
            console.log ("onCommandProcessing is equal to : ", command, response, sshObj);
        }
       };
    
    var SSH2Shell = require ('ssh2shell'),
        SSH       = new SSH2Shell(host);
    
    var callback = function (sessionText){
            console.log (sessionText);
        }
    
    SSH.connect(callback);

    
}

