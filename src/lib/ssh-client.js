const {readFileSync } = require('fs');
const {Client} = require('ssh2')

const SSHToServer =async (config)=>{
    
    const connection = new Client();
    
    connection.on('ready',() => {
        console.log('Client :: ready');
        connection.exec('ls', (err,stream)=>{
            if(err) throw err;
            stream.on('close',(code,signal)=>{
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                connection.end();
            }).on('data',(data)=>{
                console.log('STDOUT :: data: ' + data);
            }).stderr.on('data',(data)=>{
                console.log('STDERR :: data: ' + data);
            })
        })
    }).connect({
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password
    });
}

export default SSHToServer;


