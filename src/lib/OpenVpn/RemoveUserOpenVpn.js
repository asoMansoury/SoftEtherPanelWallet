let isWriting = false;

export const RemoveUserOpenVpn = async (config, selectedUser) => {
    console.log("CREATE_SOFTETHER Flag : ", process.env.CREATE_OPENVPN)
    if (process.env.CREATE_OPENVPN == false)
        return;

    var serverConfig = {
        host: config.host,
        userName: config.username,
        password: config.password,
        port: config.port,
        readyTimeout: 60000
    }
    var RemoveUserCommand = `sudo userdel -r ${selectedUser.username} &&  rm -rf  /home/${selectedUser.username}`;
    const trimmedCommand = RemoveUserCommand.replace(/\r?\n|\r/g, '');
    var host = {
        server: serverConfig,
        commands: [
            `Removing User from Open Vpn by running : ${RemoveUserCommand}`,
            trimmedCommand,
        ],
        onCommandComplete: function (command, response, sshObj) {
            //handle just one command or do it for all of the each time
            //console.log("command completed with response" , response)
        },
        onCommandProcessing: function (command, response, sshObj, stream) {

            // Respond to any prompts encountered during the installation process
            if (response.includes("Add a new client") && !isWriting) {

                stream.write(`3\n`);

                isWriting = true;

                return;
            }

            return;
        }
    };

    var SSH2Shell = require('ssh2shell'),
        SSH = new SSH2Shell(host);

    var callback = function (sessionText) {
        //console.log (sessionText);
    }

    SSH.connect(callback);


}

