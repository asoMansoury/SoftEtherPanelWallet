import Login from "src/databse/user/login";



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
      
      const { body } = req.body;

      var result = await Login(req.body);
      
      
      res.status(200).json({ result});
    } else {
        console.log("method not allow")
      res.status(405).json({ name: 'Method Not Allowed' });
    }
  }



