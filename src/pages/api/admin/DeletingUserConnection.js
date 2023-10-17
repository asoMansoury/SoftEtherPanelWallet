import { getToken } from "next-auth/jwt";
import  { DeleteUserByAdmin} from "src/databse/user/DeleteUsers";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const token = await getToken({ req });
        const { email,username } = req.query;
        if (token.isAdmin == false) {
            res.status(200).json({
                name: {
                    isValid: false,
                    errosMsg: "شما دسترسی  انجام عملیات مورد نظر را ندارید."
                }
            });
            return;
        }
        
        var userBasket = await DeleteUserByAdmin(username);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ name: {
            message:"عملیات با موفقیت انجام گردید",
            isValid :true
        } });
    }
}