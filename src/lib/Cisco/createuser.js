export const CreateUserOnCisco = async (config, username, password, expireDate) => {
  console.log("CREATE_CISCO Flag :", process.env.CREATE_CISCO);
  if (process.env.CREATE_CISCO === 'false') return;

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  // Command to run on target server (creating user)
  const targetCommand = `echo "${trimmedPassword}" | sudo -S ocpasswd -c /etc/ocserv/ocpasswd ${trimmedUsername}`;

  // Full command to run on jump server
  // It SSH-es into the target server and runs the user creation command
    let fullCommand;
    if (config.isJump) {
    fullCommand =
        `sshpass -p '${config.jumpPassword}' ssh -p ${config.jumpPort} ${config.jumpUsername}@${config.jumpHost} ` +
        `"sshpass -p '${config.password}' ssh -p ${config.port} ${config.username}@${config.host} ` +
        `\\"${targetCommand}\\""`;  // <-- close the double quote here
    } else {
    fullCommand = targetCommand;
    }

  // Configure ssh2shell connection to either jump or target server
  const serverConfig = {
        host: config.host,
        userName: config.username,
        password: config.password,
        port: config.port,
        readyTimeout: 60000,
      };

      console.log({serverConfig})
  console.log({ config });
  console.log({ fullCommand });
  const host = {
    server: serverConfig,
    commands: [
      `Generating new Cisco User Command: ${fullCommand}`,
      fullCommand,
    ],
    onCommandComplete: function (command, response, sshObj) {
      console.log("Command completed with response:", response);
    },
    onCommandProcessing: function (command, response, sshObj, stream) {
      console.log("onCommandProcessing:", command);
    },
  };

  const SSH2Shell = require("ssh2shell");
  const SSH = new SSH2Shell(host);

  SSH.connect((sessionText) => {
    console.log("Session output:", sessionText);
  });
};
