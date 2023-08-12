
import { DeleteExpiredTestedUsersJob } from "src/databse/testaccounts/DeleteExpiredTestedUsersJob";
import DeleteExpiredUsersJob from "src/databse/user/DeleteExpiredUsersJob";


export default async function handler(req,res){
    if(req.method === "GET"){
        var deleteExpiredUsersJob = await DeleteExpiredUsersJob();
        var deleteExpiredTestedUsersJob = await DeleteExpiredTestedUsersJob();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            users:deleteExpiredUsersJob,
            tests:deleteExpiredTestedUsersJob
        });
    } 
}