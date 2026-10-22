import {test,expect} from '@playwright/test';
import {seed} from '../src/lib/seed';
import {calculateMetric,monthOverMonth} from '../src/lib/metrics';
import {formatRate,formatChange} from '../src/lib/performance-view';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
test.beforeEach(async({page})=>{
 const w=seed();await page.route('**/api/workspace',r=>r.fulfill({json:{workspace:w,capabilities:{storage:'local',ai:false,model:'disabled',expiresAt:'2026-10-22T00:00:00Z'}}}));
});
test('Overview shows all five metrics, scopes partner/product/month, preserves URL selection and exposes counts',async({page})=>{
 await page.goto('/');const section=page.getByRole('region',{name:'Synthetic product performance',exact:true});await expect(section.getByText('6,081,700 / 6,100,000',{exact:true})).toBeVisible();await expect(section.getByRole('button',{name:/Show trend for/})).toHaveCount(5);
 await section.getByLabel('Performance partner').selectOption('moss');await section.getByLabel('Performance product area').selectOption('Cards, including disputes');await section.getByLabel('Performance reporting month').selectOption('2026-08');
 const c=monthOverMonth(seed().performance,'dispute-deadline','2026-08',['moss']);await expect(section.locator('.performance-table')).toContainText(formatRate(c.current.rate));await expect(section.locator('.performance-table')).toContainText(formatChange(c.changePercentagePoints));await expect(section.getByRole('button',{name:/Show trend for/})).toHaveCount(3);await expect(page).toHaveURL(/period=2026-08/);
 await page.reload();await expect(section.getByLabel('Performance product area')).toHaveValue('Cards, including disputes');await expect(section.getByLabel('Performance partner')).toHaveValue('moss');
 await section.getByText('View monthly counts and calculation',{exact:true}).click();await expect(section.getByText('Missing evidence at deadline is a failure',{exact:false})).toBeVisible();
 await section.getByLabel('Performance reporting month').selectOption('2026-04');await expect(section.locator('.performance-table')).toContainText('No comparison');
 await section.getByRole('button',{name:'Reset performance filters',exact:true}).click();await expect(section.getByLabel('Performance reporting month')).toHaveValue('2026-09');await expect(section.getByRole('button',{name:/Show trend for/})).toHaveCount(5);
});
test('Partners comparison and partner detail use the same product, period and partner counts',async({page})=>{
 await page.goto('/partners');const comparison=page.getByRole('region',{name:'Synthetic partner performance comparison'});await comparison.getByLabel('Performance product area').selectOption('Cards, including disputes');await comparison.getByLabel('Performance reporting month').selectOption('2026-08');await comparison.getByLabel('Partner comparison metric').selectOption('dispute-success');
 const value=formatRate(calculateMetric(seed().performance,'dispute-success','2026-08',['nuvia']).rate);await expect(comparison.getByRole('row').filter({hasText:'Nuvia Bank'})).toContainText(value);await comparison.getByRole('link',{name:/Nuvia Bank/}).click();
 await expect(page).toHaveURL(/partners\/nuvia\?/);const detail=page.getByRole('region',{name:'Synthetic product performance',exact:true});await expect(detail.getByLabel('Performance product area')).toHaveValue('Cards, including disputes');await expect(detail.getByLabel('Performance reporting month')).toHaveValue('2026-08');await expect(detail.locator('.performance-table')).toContainText(value);await expect(detail.getByLabel('Performance partner')).toHaveCount(0);await expect(page.getByRole('heading',{name:'Source timeline'})).toBeVisible();
});
test('invalid filters and missing observations show unavailable data rather than invented zero rates',async({page})=>{
 await page.goto('/?period=2026-10');await expect(page.getByRole('heading',{name:'Performance filters need attention'})).toBeVisible();
 const w=seed();w.performance.observations=w.performance.observations.filter(o=>!(o.partnerId==='moss'&&o.productId==='payments'&&o.periodId==='2026-09'));await page.unroute('**/api/workspace');await page.route('**/api/workspace',r=>r.fulfill({json:{workspace:w,capabilities:{storage:'local',ai:false,model:'disabled',expiresAt:'2026-10-22T00:00:00Z'}}}));await page.goto('/');const row=page.locator('.performance-table tbody tr').first();await expect(row).toContainText('Unavailable');await expect(row).toContainText('Coverage: 4/5 partners');
});
test('Stage 2 screens retain responsive bounds and pass rendered accessibility checks',async({page})=>{
 await fs.mkdir('.impeccable/review/stage2',{recursive:true});const reports=[];
 for(const width of [1440,390,1024]){
  await page.setViewportSize({width,height:1000});
  for(const [name,path] of [['overview','/'],['partners','/partners'],['partner','/partners/nuvia?area=Cards%2C+including+disputes&period=2026-09']]){
   await page.goto(path);await expect(page.getByRole('heading',{level:1})).toBeVisible();await expect(page.locator('.performance-section')).toBeVisible();await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await page.screenshot({path:`.impeccable/review/stage2/${name}-${width}.png`,fullPage:true});const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();reports.push({name,width,violations:result.violations});
  }
 }
 await fs.writeFile('.impeccable/review/stage2/accessibility.json',JSON.stringify(reports,null,2));expect(reports.flatMap(r=>r.violations.filter(v=>v.impact==='critical'||v.impact==='serious').map(v=>({name:r.name,width:r.width,id:v.id,targets:v.nodes.map(n=>n.target)})))).toEqual([]);
});

test('requested Overview metrics and updated synthetic feedback are visible',async({page})=>{
 await page.goto('/');const table=page.locator('.performance-table');for(const [name,rate,change] of [['Successful payments','99.70%','+1.50 pp'],['Reversed payment rate','0.16%','-1.35 pp'],['Successful disputes','43.52%','+1.87 pp'],['Timed out payment attempts','1.50%','-7.31 pp'],['Flagged inbound payments (Risk & Compliance)','1.43%','-10.49 pp']]){const row=table.getByRole('row').filter({hasText:name});await expect(row).toContainText(rate);await expect(row).toContainText(change)}
 await expect(page.getByText('See what matters to partners. Turn the evidence into action.',{exact:true})).toHaveCount(0);await expect(page.locator('.profile')).toContainText('Demo operator');await expect(page.locator('.profile')).not.toContainText('Avery Chen');
 await page.goto('/feedback');await page.getByText('Synthetic partner context · September 2026',{exact:true}).click();await expect(page.getByText('Payment success is improving as the rate of reversed payments decreases.',{exact:false})).toBeVisible();await expect(page.getByText('evidence is still often weak because submission guidelines are broad',{exact:false})).toBeVisible();await expect(page.getByText('suspected friends-and-family inbound payments',{exact:false}).first()).toBeVisible();
});

test('requested problems, severity, opportunities and Feedback layout align',async({page})=>{
 await page.goto('/');const table=page.locator('.issue-table');for(const [problem,severity] of [['Customers sending payments to closed beneficiary accounts','High'],['Customers sending payments to wrong beneficiary accounts (account details mismatch)','High'],['Dispute evidence is often weak as submission guidelines are broad','Medium'],['Customers not receiving OTPs in time for card payments','High'],['Customers receiving F&F inbound payments to business multicurrency accounts','Medium']]){await expect(table.getByRole('row').filter({hasText:problem})).toContainText(severity)}
 await page.goto('/feedback');await expect(page.getByRole('heading',{name:'Evidence before inference'})).toHaveCount(0);await page.getByText('Synthetic partner context · September 2026',{exact:true}).click();await expect(page.getByText('Customers are not receiving OTPs in time for card payments.',{exact:false}).first()).toBeVisible();
 await page.goto('/opportunities');for(const title of ['Help customers confirm beneficiary accounts are open','Make dispute evidence guidance specific','Help customers check beneficiary account details','Review business account receipts against declared purpose','Improve OTP delivery and recovery for card payments'])await expect(page.getByText(title,{exact:true})).toBeVisible();
});
