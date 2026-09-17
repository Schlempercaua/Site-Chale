const {chromium}=require('playwright');
const fs=require('fs');
const {execFileSync}=require('child_process');
const assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8085',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const original=execFileSync('git',['show','HEAD:index.html'],{encoding:'utf8'});
 const preservation=await page.evaluate(original=>{
   const old=new DOMParser().parseFromString(original,'text/html');
   const extract=doc=>{const walker=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);let n;const result=[];while(n=walker.nextNode()){if(n.parentElement.closest('script'))continue;const t=n.textContent.replace(/\s+/g,' ').trim();if(t)result.push(t);}return result;};
   const attrs=doc=>Array.from(doc.querySelectorAll('a')).map(e=>[e.textContent.trim(),e.getAttribute('href')]);
   return {textUnchanged:JSON.stringify(extract(old))===JSON.stringify(extract(document)),linksUnchanged:JSON.stringify(attrs(old))===JSON.stringify(attrs(document)),textNodes:extract(old).length,links:attrs(old).length,anchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.querySelector(a.getAttribute('href'))).map(a=>a.outerHTML)};
 },original);
 assert(preservation.textUnchanged,'Text changed');assert(preservation.linksUnchanged,'Links changed');assert.equal(preservation.anchors.length,0);
 const viewports=[];
 for(const width of [1440,1920,1024,768,390,320]){
   await page.setViewportSize({width,height:width<600?844:1000});
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:'artifacts/after-'+width+'.png'});
   for(const section of await page.locator('main section').all()){
     await section.scrollIntoViewIfNeeded();
     await page.waitForTimeout(60);
   }
   await page.locator('.recantos-grid .gal-item').last().scrollIntoViewIfNeeded();
   await page.locator('.recantos-grid').evaluate(el=>el.scrollLeft=0);
   await page.waitForTimeout(800);
   const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>i.id!=='lightboxImg'&&i.complete&&!i.naturalWidth).map(i=>i.src)}));
   console.log('viewport',layout);
   assert(layout.scroll<=width,'Horizontal overflow '+width);assert.equal(layout.brokenImages.length,0);
   viewports.push(layout);
   if(width===1440||width===390){
    await page.screenshot({path:'artifacts/full-'+width+'.png',fullPage:true});
    for(const id of ['sobre','galeria','recantos','comodidades','lazer','experiencias','tarifas','como-chegar','contato']){
      await page.locator('#'+id).screenshot({path:'artifacts/'+id+'-'+width+'.png',style:'.navbar,.mobile-cta,.whatsapp-float{visibility:hidden!important}'});
    }
   }
 }
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>scrollTo(0,0));
 await page.locator('#navToggle').click();
 assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');
 assert.equal(await page.evaluate(()=>document.activeElement.id),'navToggle');
 const trigger=page.locator('.gal-item').first();await trigger.focus();await page.keyboard.press('Enter');
 assert.equal(await page.evaluate(()=>document.activeElement.id),'lightboxClose');
 const firstImage=await page.locator('#lightboxImg').getAttribute('src');
 await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('#lightboxImg').getAttribute('src'),firstImage);
 await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'lightboxNext');
 await page.keyboard.press('Escape');assert(await trigger.evaluate(el=>el===document.activeElement));
 await page.locator('.form-submit').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'nome');
 assert.equal(await page.locator('[aria-invalid="true"]').count(),5);
 await page.locator('#nome').fill('Teste de interface');
 await page.locator('#checkin').fill('2027-10-20');await page.locator('#checkout').fill('2027-10-22');
 await page.locator('#hospedes').selectOption('2');await page.locator('#telefone').fill('48999999999');
 await page.evaluate(()=>{window.__opened=[];window.open=(...args)=>{window.__opened.push(args);return null;};});
 await page.locator('.form-submit').click();
 const opened=await page.evaluate(()=>window.__opened);assert.equal(opened.length,1);assert(opened[0][0].startsWith('https://api.whatsapp.com/send/?phone=5548984276280'));
 assert(page.url().startsWith('http://127.0.0.1:8085'));
 const metrics=await page.evaluate(()=>({resources:performance.getEntriesByType('resource').filter(e=>e.name.startsWith(location.origin)).map(e=>({name:e.name.split('/').pop(),bytes:e.encodedBodySize})),navigation:performance.getEntriesByType('navigation')[0].toJSON(),reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches}));
 const report={preservation,viewports,errors,interactions:'menu, keyboard gallery, focus restoration, focus trap, form errors and intercepted WhatsApp URL passed',metrics};
 fs.writeFileSync('artifacts/qa-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({...report,metrics:{reducedMotion:metrics.reducedMotion,localBytes:metrics.resources.reduce((n,r)=>n+r.bytes,0)}},null,2));
 await browser.close();
})();
