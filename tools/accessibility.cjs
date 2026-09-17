const {chromium}=require('playwright');
const fs=require('fs');
const assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const p=await browser.newPage({viewport:{width:1440,height:1000}});
 await p.addInitScript(()=>{window.__lcp=0;window.__cls=0;new PerformanceObserver(l=>{window.__lcp=l.getEntries().at(-1).startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__cls+=e.value})).observe({type:'layout-shift',buffered:true});});
 await p.goto('http://127.0.0.1:8085',{waitUntil:'networkidle'});
 await p.waitForTimeout(1500);
 const performance=await p.evaluate(()=>({lcp:window.__lcp,cls:window.__cls,initialLocalBytes:window.performance.getEntriesByType('resource').filter(e=>e.name.startsWith(location.origin)).reduce((n,e)=>n+e.encodedBodySize,0),fonts:[...document.fonts].map(f=>({family:f.family,status:f.status})),revealPending:document.querySelectorAll('.reveal-pending').length}));
 const audits=[];
 await p.addScriptTag({path:'tools/qa-deps/node_modules/axe-core/axe.min.js'});
 for(const width of [1440,390]){
  await p.setViewportSize({width,height:1000});
  for(const section of await p.locator('main section').all()){await section.scrollIntoViewIfNeeded();await p.waitForTimeout(200);}
  await p.waitForTimeout(1000);
  const result=await p.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  audits.push({width,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
 }
 await p.setViewportSize({width:1440,height:1000});await p.evaluate(()=>scrollTo(0,0));await p.mouse.move(1250,500);await p.waitForTimeout(800);
 assert.notEqual(await p.locator('#heroBg').evaluate(e=>getComputedStyle(e).transform),'none');
 await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('#heroBg').evaluate(e=>getComputedStyle(e).transform),'none');
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
 await nojs.goto('http://127.0.0.1:8085');
 const withoutJS=await nojs.locator('#sobre-titulo').evaluate(e=>({opacity:getComputedStyle(e.parentElement).opacity,text:e.textContent}));
 assert.equal(withoutJS.opacity,'1');
 fs.writeFileSync('artifacts/accessibility-report.json',JSON.stringify({performance,audits,withoutJS},null,2));
 console.log(JSON.stringify({performance,audits,withoutJS},null,2));await browser.close();
})();
