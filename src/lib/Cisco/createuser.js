export const CreateUserOnCisco = async (config,username,password,expireDate)=>{
    var serverConfig = {
        host:         config.host,
        userName:     config.username,
        password:   config.password,
        port: config.port,
        readyTimeout: 60000
      }
    
    var CreateUser = `echo "${password}" | sudo ocpasswd -c /etc/ocserv/ocpasswd ${username}`;
    
    var host = {
        server:  serverConfig,
        commands:      [
         "`This is a message that will be added to the full sessionText`",
         "msg:This is a message that will be displayed during the process",
         CreateUser,
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

