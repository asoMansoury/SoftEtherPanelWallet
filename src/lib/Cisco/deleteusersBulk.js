export const DeleteUsersCisco = async (config,username,commands)=>{
    console.log("CREATE_CISCO Flag : ",process.env.CREATE_CISCO)
    if(process.env.CREATE_CISCO == 'false' )
      return;
    
    var serverConfig = {
        host:         config.host,
        userName:     config.username,
        password:   config.password,
        port: config.port,
        readyTimeout: 60000
      }
    
    
    var host = {
        server:  serverConfig,
        commands:commands,
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

