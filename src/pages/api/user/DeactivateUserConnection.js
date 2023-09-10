import { getToken } from "next-auth/jwt";
import  { DeleteUserOfByClient } from "src/databse/user/DeleteUsers";

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
        var userBasket = await DeleteUserOfByClient(username);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ name: {
            message:"عملیات با موفقیت انجام گردید"
        } });
    }
}