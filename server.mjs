import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
http.createServer(async(req,res)=>{try{const urlPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const actual=path.resolve(root,'.'+(urlPath==='/'?'/index.html':urlPath));if(!actual.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}const data=await readFile(actual);res.setHeader('Content-Type',actual.endsWith('.js')?'text/javascript':'text/html');res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(5173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:5173'));
