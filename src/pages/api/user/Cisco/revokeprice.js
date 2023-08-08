
import  { CalculatingForRevoke } from "src/databse/user/CiscoMethods/RevokeUser";




export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      
        // Allow CORS preflight request
        res.status(200).end();

        return;
      }
      try{
        if (req.method === 'POST') {

          // Handle the POST request here
          const { username,tariffplancode,tariffcode,type } = req.body;

          var result = await CalculatingForRevoke(username,tariffplancode,tariffcode,type);
          
          res.status(200).json({ result});
        } else {
            console.log("method not allow")
          res.status(405).json({ name: 'Method Not Allowed' });
        }
      }catch(e){
        throw e;
      }

  }



