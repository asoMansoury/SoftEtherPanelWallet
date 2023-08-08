import { GetTutorials } from 'src/databse/Tutorial/getTutorials';


export default async function handler(req,res){
    if(req.method === "GET"){

        var links = await GetTutorials();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({name:links});
        
    }
}