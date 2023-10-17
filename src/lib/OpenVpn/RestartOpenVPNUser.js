let isWriting = false;

export const RestartOpenVPNUser = async (config, selectedUser) => {
    console.log("CREATE_OpenVPN Flag : ", process.env.CREATE_OPENVPN)
    if (process.env.CREATE_OPENVPN == false)
        return;

    var serverConfig = {
        host:         config.host,
        userName:     config.username,
        password:   config.password,
        port: config.port,
        readyTimeout: 60000
    }
    var RemoveUserCommand = `sudo userdel -r ${selectedUser.username} ||  rm -rf  /home/${selectedUser.username} && sudo useradd -m ${selectedUser.username} && echo '${selectedUser.username}:${selectedUser.password}' | sudo chpasswd`;
    const trimmedRemoveCommand = RemoveUserCommand.replace(/\r?\n|\r/g, '');
    var host = {
        server: serverConfig,
        commands: [
            `this command is running ---------->> ${trimmedRemoveCommand}`,
            trimmedRemoveCommand,
        ],
        onCommandComplete: function (command, response, sshObj) {
            //handle just one command or do it for all of the each time
            console.log("command completed with response", response)
        },
        onCommandProcessing: function (command, response, sshObj, stream) {
            console.log("onCommandProcessing is equal to : ", command, response, sshObj);

            // // Respond to any prompts encountered during the installation process
            // if (response.includes("Add a new client") && !isWriting) {

            //     stream.write(`1\n`);
            //     stream.write(`asoVpn9\n`);
            //     isWriting = true;

            //     return;
            // }

            // return;
        }
    };

    var SSH2Shell = require('ssh2shell'),
        SSH = new SSH2Shell(host);

    var callback = function (sessionText) {
        console.log(sessionText);
    }

    SSH.connect(callback);


}

