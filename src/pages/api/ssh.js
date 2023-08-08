
import { CreateUserOnOpenVpn } from 'src/lib/OpenVpn/CreateUserOpenVpn';
import { RemoveUserOpenVpn } from 'src/lib/OpenVpn/RemoveUserOpenVpn';


export default async function handler(req,res){
    if(req.method === "GET"){
       // var servers = await GetServers();
        //console.log("Servers are loaded : ", servers);

        // var newUser = await CreateUser();
        // console.log("New user is ready to commit in the database: ", newUser);
        // await RegisterUsersInDB(servers, newUser);
        RemoveUserOpenVpn();

        // servers.map((server,index)=>{
        //     //var serverResult = SSHToServer(server);
        //     CreateUserOnSoftEther(server,newUser);
        //  });
        res.status(200).json({name:"Aso Mansouri"});
    }
}