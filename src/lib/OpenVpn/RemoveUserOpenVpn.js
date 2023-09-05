let isWriting = false;

export const RemoveUserOpenVpn = async (config, selectedUser) => {
    console.log("CREATE_SOFTETHER Flag : ", process.env.CREATE_OPENVPN)
    if (process.env.CREATE_OPENVPN == false)
        return;

    var serverConfig = {
        host: "91.107.129.236",
        userName: "root",
        password: "AdminAso@123",
        port: "22",
        readyTimeout: 60000
    }
    var RemoveUserCommand = `sudo userdel -r ${selectedUser.username}`;

    var host = {
        server: serverConfig,
        commands: [
            "`This is a message that will be added to the full sessionText`",
            "msg:This is a message that will be displayed during the process",
            RemoveUserCommand,

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

