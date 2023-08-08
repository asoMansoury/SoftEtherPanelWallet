
import CheckIsUserExists from "src/databse/customers/checkuserexists";
import GetCustomerByEmailAndPassword from "src/databse/customers/getcustomer";

async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Origin', ' *');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'GET') {
      // Allow CORS preflight request
      res.status(200).end();

      return;
    }
    if (req.method === 'OPTIONS') {
        // Allow CORS preflight request
        res.status(200).end();

        return;
      }
    if (req.method === 'POST') {
      
      // Handle the POST request here
        const { email,password } = req.body;

        var customerObj = await CheckIsUserExists(email);
        
        res.status(200).json({ name: customerObj});
    } else {
        console.log("method not allow",req.method)
      res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default  handler






