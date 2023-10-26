
import CalculateUserForRevoke from "src/databse/user/CalculateUserForRevoke";



export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {

        // Allow CORS preflight request
        res.status(200).end();

        return;
      }
    if (req.method === 'POST') {
      
      // Handle the POST request here
      const { username,uuid } = req.body;
      var result =await CalculateUserForRevoke(username,uuid);
      if(result==null)
        res.status(200).json({ name: "عملیات با شکست مواجه شد، لطفا با پشتیبانی تماس بگیرید."});
    


      // Return a response
      res.status(200).json({ name: result});
   }else {
        console.log("method not allow")
      res.status(405).json({ message: 'Method Not Allowed' });
    }
    
  }





