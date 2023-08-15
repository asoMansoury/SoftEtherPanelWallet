let isWriting = false;

export const CreateUserOnOpenVpn = async (config,createdUser,groupPolicy,expireDate)=>{
    if(process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development'){
        console.log(process.env.NODE_ENV);
        console.log("hello")
        return;
    }
    var serverConfig = {
        host:         "135.181.107.1",
        userName:     "root",
        password:   "AdminAso",
        port: "22",
        readyTimeout: 60000
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
            console.log("command completed with response" , response)
        },
        onCommandProcessing: function (command, response, sshObj, stream){
            console.log ("onCommandProcessing is equal to : ", command, response, sshObj);

                  // Respond to any prompts encountered during the installation process
                if (response.includes("Add a new client")&& !isWriting) {
                    
                    stream.write(`1\n`);
                    stream.write(`asoVpn9\n`);
                    isWriting = true;

                    return;
                }

                return;
        }
       };
    
    var SSH2Shell = require ('ssh2shell'),
        SSH       = new SSH2Shell(host);
    
    var callback = function (sessionText){
            console.log (sessionText);
        }
    
    SSH.connect(callback);

    
}

