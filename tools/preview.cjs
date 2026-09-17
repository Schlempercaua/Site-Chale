const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
http.createServer((req,res)=>{
 const name=decodeURIComponent(req.url.split('?')[0]);
 const file=path.resolve(root, '.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png','.pdf':'application/pdf'})[path.extname(file)]||'application/octet-stream');res.end(data);});
}).listen(8085,'127.0.0.1',()=>console.log('http://127.0.0.1:8085'));
