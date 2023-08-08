export const SSH2ShellFunc = async (config,createdUser)=>{
    var host = {
        server:        {
          host:         config.host,
          userName:     config.username,
          password:   config.password,
          port: config.port
        },
        commands:      [
         "`This is a message that will be added to the full sessionText`",
         "msg:This is a message that will be displayed during the process",
         "/opt/softether/vpncmd -SERVER 127.0.0.1 -PASSWORD:AdminAso@123",
          "Hub Srv1HubBridge",
          "UserCreate tplink /GROUP:test  /REALNAME:'' /NOTE:''",
          `UserPasswordSet tplink /PASSWORD:1234`,
          `UserExpiresSet tplink /EXPIRES:"2023/08/08 19:30:00"`
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

