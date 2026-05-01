const { chromium } = require('playwright');
const { execSync } = require('child_process');

const baseUrl = 'http://127.0.0.1:3000';

function ensureServer() {
  try {
    const result = execSync('curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/', { timeout: 5000 }).toString().trim();
    if (result === '200') return true;
  } catch (e) {}
  
  // Start server
  console.log('Starting Next.js server...');
  try {
    execSync('cd /home/z/my-project && npx next dev -p 3000 > /dev/null 2>&1 &', { timeout: 5000 });
  } catch (e) {}
  
  // Wait for server
  for (let i = 0; i < 10; i++) {
    try {
      execSync('sleep 2');
      const r = execSync('curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/', { timeout: 5000 }).toString().trim();
      if (r === '200') {
        console.log('Server ready');
        return true;
      }
    } catch (e) {}
  }
  return false;
}

async function testViewport(vp) {
  const browser = await chromium.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });
  
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  
  console.log('\n=== ' + vp.name + ' (' + vp.width + 'x' + vp.height + ') ===');
  try {
    await page.goto(baseUrl + vp.path, { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/qa-' + vp.name + vp.suffix + '.png' });
    
    const info = await page.evaluate((vw) => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const bodyWidth = document.body.scrollWidth;
      
      const overflowing = [];
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > vw + 2 || rect.left < -2) {
          overflowing.push({
            tag: el.tagName,
            cls: (el.className || '').toString().substring(0, 80),
            right: Math.round(rect.right),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
          });
        }
      });
      
      return { scrollWidth, clientWidth, bodyWidth, hasHScroll: scrollWidth > clientWidth, overflowCount: overflowing.length, overflowing: overflowing.slice(0, 15) };
    }, vp.width);
    
    console.log('  H-scroll: ' + (info.hasHScroll ? 'YES (PROBLEM!)' : 'No') + ' (scrollW=' + info.scrollWidth + ', clientW=' + info.clientWidth + ', bodyW=' + info.bodyWidth + ')');
    if (info.overflowCount > 0) {
      console.log('  Overflow elements (' + info.overflowCount + '):');
      info.overflowing.forEach(el => console.log('    - <' + el.tag + '> cls="' + el.cls + '" right=' + el.right + ' left=' + el.left + ' w=' + el.width));
    } else {
      console.log('  No overflow elements');
    }
    
    // Additional checks
    const extras = await page.evaluate(() => {
      const nav = document.querySelector('nav') || document.querySelector('header');
      const navInfo = nav ? Math.round(nav.getBoundingClientRect().width) + 'x' + Math.round(nav.getBoundingClientRect().height) : 'Not found';
      
      const buttons = Array.from(document.querySelectorAll('button, a[class*="btn"], a[role="button"]')).map(b => ({
        text: (b.innerText || '').substring(0, 30).trim(),
        visible: b.getBoundingClientRect().width > 0 && b.getBoundingClientRect().height > 0,
      })).filter(b => b.text);
      
      const forms = document.querySelectorAll('form').length;
      const inputs = document.querySelectorAll('input').length;
      
      return { navInfo, buttons, forms, inputs };
    });
    
    console.log('  Nav: ' + extras.navInfo);
    console.log('  Buttons: ' + extras.buttons.length);
    extras.buttons.forEach(b => console.log('    - "' + b.text + '" visible=' + b.visible));
    if (extras.forms > 0) console.log('  Forms: ' + extras.forms + ', Inputs: ' + extras.inputs);
    
  } catch (e) {
    console.log('  ERROR: ' + e.message.substring(0, 300));
  }
  
  await context.close();
  await browser.close();
}

async function run() {
  const tests = [
    { name: 'iphone-se-320', width: 320, height: 568, path: '/', suffix: '-landing' },
    { name: 'iphone-14-390', width: 390, height: 844, path: '/', suffix: '-landing' },
    { name: 'iphone-plus-414', width: 414, height: 896, path: '/', suffix: '-landing' },
    { name: 'iphone-14-390', width: 390, height: 844, path: '/login', suffix: '-login' },
  ];
  
  for (const test of tests) {
    ensureServer();
    await testViewport(test);
  }
  
  // Scroll test for 390px
  ensureServer();
  await testScroll();
  
  console.log('\n=== All tests complete ===');
}

async function testScroll() {
  const browser = await chromium.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  
  console.log('\n=== Scroll Test (390px) ===');
  try {
    await page.goto(baseUrl + '/', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log('  Page height: ' + totalHeight + 'px');
    
    // Scroll to 1/3
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 3));
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/qa-390-scroll-mid.png' });
    const midH = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log('  H-scroll at 1/3: ' + (midH ? 'YES' : 'No'));
    
    // Scroll to 2/3
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 2 / 3));
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/qa-390-scroll-23.png' });
    const twoThirdH = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log('  H-scroll at 2/3: ' + (twoThirdH ? 'YES' : 'No'));
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/qa-390-scroll-bottom.png' });
    const bottomH = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log('  H-scroll at bottom: ' + (bottomH ? 'YES' : 'No'));
    
    // Full page screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/qa-390-landing-full.png', fullPage: true });
    console.log('  Full page screenshot saved');
    
  } catch (e) {
    console.log('  ERROR: ' + e.message.substring(0, 300));
  }
  
  await context.close();
  await browser.close();
}

run().catch(console.error);
