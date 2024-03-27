import { getToken } from "next-auth/jwt";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
import DeleteUserOfAgent from "src/databse/user/DeleteUsers";
import GetUserDetails from "src/databse/user/ShowingUserDetail";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const token = await getToken({ req });
        const { username } = req.query;
        if (token == null) {
            res.status(200).json({
                name: {
                    isValid: false,
                    errosMsg: "شما دسترسی  انجام عملیات مورد نظر را ندارید."
                }
            });
            return;
        }
        var isAgent = await IsAgentValid(token.email);
        var agentCode = "";
        if (isAgent.isAgent == false) {
            res.status(200).json({
                name: {
                    isValid: false,
                    message: "شما دسترسی  انجام عملیات مورد نظر را ندارید."
                }
            });
            return;
        } else {
            agentCode = isAgent.agentcode;
        }
        var userBasket = await GetUserDetails(username,token.agentCode,token.email);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ userBasket });
    }
}