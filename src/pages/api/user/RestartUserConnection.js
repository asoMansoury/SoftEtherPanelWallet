import { getToken } from "next-auth/jwt";
import { IsAgentValid } from "src/databse/agent/getagentinformation";
import RestartUserConnection from "src/databse/user/UsersFunction/DeleteUsers";

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

        var userBasket = await RestartUserConnection(username);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ name: userBasket });
    }
}