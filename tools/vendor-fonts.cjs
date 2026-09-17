const fs=require('fs');
(async()=>{
 const url='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600&display=swap';
 const res=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}});if(!res.ok)throw Error(res.status);
 let css=await res.text();
 // Latin includes all Portuguese glyphs used by the site.
 const blocks=[...css.matchAll(/\/\* latin \*\/[\s\S]*?\}/g)].map(m=>m[0]);
 if(!blocks.length)throw Error('No Latin font faces returned');
 css=blocks.join('\n');fs.mkdirSync('fonts',{recursive:true});
 const urls=[...new Set([...css.matchAll(/https:\/\/fonts.gstatic.com\/[^)]+/g)].map(m=>m[0]))];
 for(let i=0;i<urls.length;i++){
   const r=await fetch(urls[i]);if(!r.ok)throw Error(r.status);
   const name='font-'+i+'.woff2';fs.writeFileSync('fonts/'+name,Buffer.from(await r.arrayBuffer()));css=css.replaceAll(urls[i],'../fonts/'+name);
 }
 fs.writeFileSync('css/fonts.css',css);
 // Keep open-font licensing with locally served font binaries.
 for(const name of ['cormorantgaramond','manrope']){
   const r=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/'+name+'/OFL.txt');if(!r.ok)throw Error(r.status);
   fs.writeFileSync('fonts/'+name+'-OFL.txt',await r.text());
 }
 console.log('Stored '+urls.length+' font files locally.');
})();
