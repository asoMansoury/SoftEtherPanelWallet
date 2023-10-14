import { getToken } from "next-auth/jwt";
import { GetAgentForServerAdmin } from "src/configs/AgentsForServer";
import EnableIPV4 from "src/databse/admin/EnableIPv4";
import { RestartOpenVpn } from "../../../lib/AdminConfigs/RestartOpenVpn";
import RestartOpenVpnFunc from "src/databse/admin/RestartOpenVpn";





export default async function handler(req,res){
    if(req.method === "GET"){
        const {serverCode } = req.query;
        const token = await getToken({ req });
        if(GetAgentForServerAdmin(token.email).isValid==true){
            RestartOpenVpnFunc();
        }else{
            res.status(200).json({
                isValid:false,
                errorMessage:"شما مجاز به انجام عملیات نمی باشید."
            });
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            isValid:true,
            errorMessage:"عملیات با موفقیت انجام گردید."
        });
    }
}