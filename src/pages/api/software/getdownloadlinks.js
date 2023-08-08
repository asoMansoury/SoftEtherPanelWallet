import { GetSoftwareLinks } from 'src/databse/Software/getSoftwareLinks';


export default async function handler(req,res){
    if(req.method === "GET"){

        var links = await GetSoftwareLinks();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:links});
    }
}