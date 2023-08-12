let isWriting = false;

export const RemoveUserOpenVpn = async (config,createdUser,groupPolicy,expireDate)=>{
    return;
    var serverConfig = {
        host:         "135.181.107.1",
        userName:     "root",
        password:   "AdminAso",
        port: "22"
      }
    var RunScript = `/root/./openvpn.sh`
    
    var host = {
        server:  serverConfig,
        commands:      [
         "`This is a message that will be added to the full sessionText`",
         "msg:This is a message that will be displayed during the process",
         RunScript,

        ],
        onCommandComplete:   function( command, response, sshObj) {
            //handle just one command or do it for all of the each time
            //console.log("command completed with response" , response)
        },
        onCommandProcessing: function (command, response, sshObj, stream){

                  // Respond to any prompts encountered during the installation process
                if (response.includes("Add a new client")&& !isWriting) {
                    
                    stream.write(`3\n`);
                    
                    isWriting = true;
                    
                    return;
                }
                
                return;
        }
       };
    
    var SSH2Shell = require ('ssh2shell'),
        SSH       = new SSH2Shell(host);
    
    var callback = function (sessionText){
            //console.log (sessionText);
        }
    
    SSH.connect(callback);

    
}

