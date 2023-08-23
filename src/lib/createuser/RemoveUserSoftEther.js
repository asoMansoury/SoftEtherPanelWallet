export const RemoveUserSoftEther = async (config,createdUser)=>{
    console.log("CREATE_SOFTETHER Flag : ",process.env.CREATE_SOFTETHER)
    if(process.env.CREATE_SOFTETHER == 'false' )
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
    var RemoveUserFromHub = `UserDelete ${createdUser.username} `;
    
    var host = {
        server:  serverConfig,
        commands:      [
         "`This is a message that will be added to the full sessionText`",
         "msg:This is a message that will be displayed during the process",
         Vpncmd,
         HubName,
         RemoveUserFromHub
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

