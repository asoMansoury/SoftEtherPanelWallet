const {readFileSync } = require('fs');
const {Client} = require('ssh2')

const SSHToServer =async (config)=>{
    
    const conn = new Client();

    conn.on('ready', () => {
    console.log('SSH connection established');
    
    const selectHubCmd = '/opt/softether/vpncmd /SERVER 127.0.0.1 /CMD Hub Srv1Bridge /PASSWORD:AdminAso@123'; // Replace with the actual Hub's Admin Password
    
    const createUserCmd = 'vpncmd /SERVER 127.0.0.1 /HUB Srv1Bridge /CMD UserCreate your-username /GROUP:none /REALNAME:none /NOTE:none /EXTENSION:none /PASSWORD:your-password'; // Replace with desired username and password
    
    conn.exec(selectHubCmd, (err, stream) => {
        if (err) throw err;

            stream.on('data', (data) => {
            console.log('Received: ' + data);
        });
        stream.on('close', () => {
        console.log('Virtual Hub selection completed. Creating user...');
        
        conn.exec(createUserCmd, (err, stream) => {
            if (err) throw err;
            stream.on('data', (data) => {
            console.log('Received: ' + data);
            });
            stream.on('close', () => {
            console.log('User creation completed');
            conn.end();
            });
        });
        });
    });
    });
    conn.on('error', (err) => {
        console.error('Error connecting via SSH:', err);
    }).connect({
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password
    });
}

export default SSHToServer;