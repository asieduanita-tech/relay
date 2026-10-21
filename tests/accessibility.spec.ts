import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
test('rendered accessibility and state evidence',async({page})=>{
 const reports=[];
 for(const width of [1440,390,1024]){
  await page.setViewportSize({width,height:1000});
  for(const [name,route] of [['overview','/'],['review','/feedback?tab=review'],['import','/feedback/import'],['opportunity','/opportunities/o1'],['partners','/partners'],['empty','/?partner=moss&area=Risk+%26+Compliance']]){
   await page.goto(route);await expect(page.locator('h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:`.impeccable/review/${name}-${width}.png`,fullPage:true});
   const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   reports.push({route,width,violations:results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  }
 }
 await fs.writeFile('.impeccable/review/accessibility.json',JSON.stringify(reports,null,2));
 const violations=reports.flatMap(r=>r.violations.filter(v=>v.impact==='serious'||v.impact==='critical').map(v=>({route:r.route,width:r.width,...v})));
 expect(violations).toEqual([]);
});
