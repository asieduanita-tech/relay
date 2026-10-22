import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import {seed} from '../src/lib/seed';
const routes=[['overview','/'],['partners','/partners'],['partner','/partners/moss'],['feedback','/feedback'],['issue','/issues/i1'],['opportunities','/opportunities'],['opportunity','/opportunities/o2']];
test('Stage 4 rendered review across desktop tablet and mobile',async({page})=>{
 test.setTimeout(180000);await page.route('**/api/workspace',r=>r.fulfill({json:{workspace:seed(),capabilities:{storage:'local',ai:false,model:'disabled'}}}));await fs.mkdir('.impeccable/review/stage4',{recursive:true});const reports=[];
 for(const width of [390,1024,1440])for(const [name,path] of routes){await page.setViewportSize({width,height:1000});await page.goto(path);await expect(page.locator('h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`.impeccable/review/stage4/${name}-${width}.png`,fullPage:true});const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();reports.push({name,width,violations:audit.violations})}
 await fs.writeFile('.impeccable/review/stage4/accessibility.json',JSON.stringify(reports,null,2));const serious=reports.flatMap(r=>r.violations.filter(v=>v.impact==='serious'||v.impact==='critical').map(v=>({name:r.name,width:r.width,id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));expect(serious).toEqual([]);
});

test('loading, retry, empty recovery, keyboard tabs and reduced motion',async({page})=>{
 let release:()=>void=()=>{};const gate=new Promise<void>(resolve=>{release=resolve});let fail=true;
 await page.route('**/api/workspace',async route=>{await gate;if(fail)return route.fulfill({status:503,json:{error:'Synthetic test: temporarily unavailable'}});return route.fulfill({json:{workspace:seed(),capabilities:{storage:'local',ai:false}}})});
 await page.goto('/');await expect(page.getByRole('status',{name:'Loading demo workspace'})).toBeVisible();release();await expect(page.getByRole('heading',{name:'Relay needs a connection.'})).toBeVisible();fail=false;await page.getByRole('button',{name:'Retry loading'}).click();await expect(page.locator('h1')).toHaveText('Partner intelligence');
 await page.goto('/feedback?source=missing');await expect(page.getByRole('heading',{name:'No feedback matches'})).toBeVisible();await page.getByRole('link',{name:'Show all feedback',exact:true}).last().click();await expect(page.locator('.source-list .source-entry')).toHaveCount(21);
 const all=page.getByRole('tab',{name:/All sources/});await all.focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{name:/Needs review/})).toBeFocused();await expect(page.getByRole('tab',{name:/Needs review/})).toHaveAttribute('aria-selected','true');await page.keyboard.press('Home');await expect(all).toBeFocused();
 await page.goto('/opportunities/o2');const context=page.getByRole('region',{name:'Connected evidence'});await expect(context.locator('.context-disclosure')).not.toHaveAttribute('open');await expect(page.getByRole('heading',{name:'Record a decision'})).toBeVisible();await context.locator('summary').first().click();await expect(context.getByRole('link',{name:'Inspect supporting sources (4)'})).toBeVisible();
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');expect(await page.locator('.chart-fill').first().evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
});

test('mobile navigation contains focus, restores it, and supports synthesized touch',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();await page.route('**/api/workspace',r=>r.fulfill({json:{workspace:seed(),capabilities:{storage:'local',ai:false}}}));await page.goto('/');const menu=page.getByRole('button',{name:'Open navigation'});await menu.tap();const dialog=page.getByRole('dialog',{name:'Workspace navigation'});await expect(dialog).toBeVisible();await expect(dialog.getByRole('button',{name:'Close navigation'})).toBeFocused();await dialog.locator('a').last().focus();await page.keyboard.press('Tab');await expect(dialog.locator('a').first()).toBeFocused();await page.keyboard.press('Escape');await expect(menu).toBeFocused();await expect(menu).toHaveAttribute('aria-expanded','false');await menu.tap();await dialog.getByRole('link',{name:'Partners',exact:true}).tap();await expect(page.locator('h1')).toHaveText('The partners behind the signal');await expect(page.getByRole('dialog')).toHaveCount(0);await context.close();
});

test('long source content and enlarged reading text remain bounded',async({page})=>{
 const w=seed();w.sources[0].text='Synthetic long reference: '+('beneficiaryreference'.repeat(45));w.findings[0].quote=w.sources[0].text;w.findings[0].end=w.sources[0].text.length;
 await page.route('**/api/workspace',r=>r.fulfill({json:{workspace:w,capabilities:{storage:'local',ai:false}}}));await page.setViewportSize({width:390,height:844});await page.goto('/feedback?source=s1');await expect(page.locator('.source-list mark')).toBeVisible();await page.addStyleTag({content:'.source-quote-button p,.finding blockquote{font-size:26px!important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
