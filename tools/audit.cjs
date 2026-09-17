const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 fs.mkdirSync('artifacts',{recursive:true});
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('http://127.0.0.1:8085',{waitUntil:'networkidle'});
 await page.screenshot({path:'artifacts/before-desktop.png'});
 const inventory=await page.evaluate(()=>({text:document.body.textContent,sections:[...document.querySelectorAll('section')].map(e=>({id:e.id,text:e.innerText})),links:[...document.querySelectorAll('a')].map(e=>({text:e.textContent,href:e.getAttribute('href')})),images:[...document.images].map(e=>({src:e.getAttribute('src'),alt:e.alt})),fields:[...document.querySelectorAll('input,select,textarea')].map(e=>({id:e.id,type:e.type,placeholder:e.getAttribute('placeholder')}))}));
 fs.writeFileSync('artifacts/content-before.json',JSON.stringify(inventory,null,2));
 const files=fs.readdirSync('img',{recursive:true}).filter(x=>x.endsWith('.jpg'));
 await page.setContent('<body style="margin:0;background:#eee;display:grid;grid-template-columns:repeat(7,1fr);gap:12px;font:13px sans-serif">'+files.map(f=>'<div><img style="width:100%;height:210px;object-fit:cover" src="http://127.0.0.1:8085/img/'+f.replaceAll('\\','/')+'"><p>'+f+'</p></div>').join(''));
 await page.waitForTimeout(1200);
 await page.screenshot({path:'artifacts/photo-inventory.jpg',fullPage:true});
 console.log(JSON.stringify(inventory.sections.map(s=>({id:s.id,text:s.text})),null,2));
 await browser.close();
})();
