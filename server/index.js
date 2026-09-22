import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { resolve,extname,sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { createApi } from './api.js'
const root=fileURLToPath(new URL('../',import.meta.url));dotenv.config({path:[resolve(root,'.env.local'),resolve(root,'.env')],quiet:true});const api=createApi({authUrl:process.env.VITE_NEON_AUTH_URL,databaseUrl:process.env.DATABASE_URL}),dist=resolve(root,'dist');const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
createServer((req,res)=>api(req,res,async()=>{try{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end()}const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);if(pathname.split('/').some(x=>x.startsWith('.'))){res.writeHead(404);return res.end()}let file=resolve(dist,'.'+pathname);if(file!==dist&&!file.startsWith(dist+sep)){res.writeHead(403);return res.end()}let info=await stat(file).catch(()=>null);if(!info?.isFile()){if(extname(pathname)){res.writeHead(404);return res.end()}file=resolve(dist,'index.html');info=await stat(file)}res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Content-Length':info.size,'Cache-Control':file.includes(`${sep}assets${sep}`)?'public,max-age=31536000,immutable':'no-cache'});if(req.method==='HEAD')return res.end();createReadStream(file).pipe(res)}catch{res.writeHead(500);res.end('Execute npm run build.')}})).listen(Number(process.env.PORT||5174),process.env.HOST||'0.0.0.0',()=>console.log(`Rota Viva iniciada na porta ${process.env.PORT||5174}.`))
