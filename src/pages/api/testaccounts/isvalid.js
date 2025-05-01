import { getSession } from "next-auth/react";
import { getTariffs } from "src/databse/tariff/getTariff";
import {  IsValidForCreatingNewTestAccount } from "src/databse/testaccounts/GenerateNewAccountTest";



export default async function handler(req,res){
    if(req.method === "GET"){
        const {email,type,servercode } = req.query;

        var tariffs = await IsValidForCreatingNewTestAccount(email,type,servercode );

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:tariffs});
    }
}