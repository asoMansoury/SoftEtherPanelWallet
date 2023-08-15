export const UpdateExpirationTimeSoftEther = async (config,createdUser,nextExpirationDate)=>{
    if(process.env.NODE_ENV !== 'test' || process.env.NODE_ENV != 'development')
        return;
    var serverConfig = {
        host:         config.host,
        userName:     config.username,
        password:   config.password,
        port: config.port,
        readyTimeout: 60000
      }
    var Vpncmd = `/opt/softether/vpncmd -SERVER 127.0.0.1 -PASSWORD:${config.vpncmdpassword}`
    var HubName = `Hub ${config.HubName}`;
    var GoingToExpirationMode = `UserExpiresSet ${createdUser.username} /EXPIRES:"${nextExpirationDate}"`;
    
    var host = {
        server:  serverConfig,
        commands:      [
         "`This is a message that will be added to the full sessionText`",
         "msg:This is a message that will be displayed during the process",
         Vpncmd,
         HubName,
         GoingToExpirationMode
        ],
        onCommandComplete:   function( command, response, sshObj) {
            //handle just one command or do it for all of the each time
            console.log("onCommandCompleted is equal to :" , response)
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

