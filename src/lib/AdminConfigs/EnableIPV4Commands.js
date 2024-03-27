let isWriting = false;

export const EnableIPV4Commands = async (config) => {
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
    
    var EnableIPV4 = `sudo sysctl net.ipv4.ip_forward=1`;
    var EnableMasquerade = `sudo iptables -t nat -A POSTROUTING ! -s 127.0.0.1 -j MASQUERADE`;
    const trimmedCommand = EnableIPV4.replace(/\r?\n|\r/g, '');
    const trimmedCommand2 = EnableMasquerade.replace(/\r?\n|\r/g, '');
    var host = {
        server: serverConfig,
        commands: [
            `This is a message that will be added ${trimmedCommand}`,
            trimmedCommand,
            trimmedCommand2
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

