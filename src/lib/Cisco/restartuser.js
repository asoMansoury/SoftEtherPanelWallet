
        // fullCommand =
        // `sshpass -p '${config.jumpPassword}' ssh -p ${config.jumpPort} ${config.jumpUsername}@${config.jumpHost} ` +
        // `"sshpass -p '${config.password}' ssh -p ${config.port} ${config.username}@${config.host} ` +
        // `\\"${targetCommand}\\""`;  // <-- close the double quote here
export const RestartUserCisco = async (config, username, password) => {
    console.log(" RestartUserCisco method : CREATE_CISCO Flag : ", process.env.CREATE_CISCO)
    if (process.env.CREATE_CISCO == 'false')
        return;



    var DeleteUserCommand = `sudo ocpasswd -c /etc/ocserv/ocpasswd -d  ${username} && sudo echo "${password.trim()}" | sudo ocpasswd -c /etc/ocserv/ocpasswd ${username.trim()}`;
    const targetCommand = DeleteUserCommand.replace(/\r?\n|\r/g, '');

    let fullCommand;
    if (config.isJump) {
      var firsServerSSH = `ssh -p ${config.port} ${config.username}@${config.host}`;

      
        const serverConfig = {
            host: config.jumpHost,
            userName: config.jumpUsername,
            password: config.jumpPassword,
            port: config.jumpPort,
            readyTimeout: 60000,
          };
          
        var host = {
            server:  serverConfig,
            commands:      [
            "`removing cisco user command`",
            firsServerSSH,
            targetCommand,
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

    } else {
        fullCommand = targetCommand;

    var serverConfig = {
        host: config.host,
        userName: config.username,
        password: config.password,
        port: config.port,
        readyTimeout: 60000
        }
      var host = {
        server: serverConfig,
        commands: [
            `running this command ---->> : ${fullCommand}`,
            fullCommand,
        ],
        onCommandComplete: function (command, response, sshObj) {
            //handle just one command or do it for all of the each time
            console.log("command completed with response", response)
        },
        onCommandProcessing: function (command, response, sshObj, stream) {
            console.log("onCommandProcessing is equal to : ", command, response, sshObj);
        }
    };

    var SSH2Shell = require('ssh2shell'),
        SSH = new SSH2Shell(host);

    var callback = function (sessionText) {
        console.log(sessionText);
    }

    SSH.connect(callback);

    }

    var host = {
        server: serverConfig,
        commands: [
            `running this command ---->> : ${fullCommand}`,
            fullCommand,
        ],
        onCommandComplete: function (command, response, sshObj) {
            //handle just one command or do it for all of the each time
            console.log("command completed with response", response)
        },
        onCommandProcessing: function (command, response, sshObj, stream) {
            console.log("onCommandProcessing is equal to : ", command, response, sshObj);
        }
    };

    var SSH2Shell = require('ssh2shell'),
        SSH = new SSH2Shell(host);

    var callback = function (sessionText) {
        console.log(sessionText);
    }

    SSH.connect(callback);


}

