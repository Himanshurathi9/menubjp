const { chromium } = require('playwright');

const viewports = [
  { name: 'iphone-se-320', width: 320, height: 568 },
  { name: 'iphone-14-390', width: 390, height: 844 },
  { name: 'iphone-plus-414', width: 414, height: 896 },
];

const baseUrl = 'http://127.0.0.1:3000';

async function run() {
  const browser = await chromium.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });
  
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    
    // Test landing page
    console.log(`\n=== Testing ${vp.name} (${vp.width}x${vp.height}) - Landing Page ===`);
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `/tmp/qa-${vp.name}-landing.png`, fullPage: false });
      console.log(`  Screenshot saved: /tmp/qa-${vp.name}-landing.png`);
      
      // Check for horizontal scroll
      const scrollInfo = await page.evaluate((vw) => {
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        const bodyWidth = document.body.scrollWidth;
        return { scrollWidth, clientWidth, bodyWidth, hasHScroll: scrollWidth > clientWidth };
      }, vp.width);
      console.log(`  Horizontal scroll: ${scrollInfo.hasHScroll ? 'YES (PROBLEM!)' : 'No'} (scrollWidth=${scrollInfo.scrollWidth}, clientWidth=${scrollInfo.clientWidth}, bodyWidth=${scrollInfo.bodyWidth})`);
      if (scrollInfo.bodyWidth > vp.width) {
        console.log(`  WARNING: Body wider than viewport by ${scrollInfo.bodyWidth - vp.width}px!`);
      }
      
      // Check for overflow elements
      const overflowElements = await page.evaluate((vw) => {
        const elements = document.querySelectorAll('*');
        const overflowing = [];
        elements.forEach(el => {
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
        return overflowing.slice(0, 15);
      }, vp.width);
      
      if (overflowElements.length > 0) {
        console.log(`  Overflow elements (${overflowElements.length}):`);
        overflowElements.forEach(el => {
          console.log(`    - <${el.tag}> class="${el.cls}" right=${el.right} left=${el.left} width=${el.width}`);
        });
      } else {
        console.log(`  No overflow elements detected`);
      }
      
      // Check for visible text
      const pageText = await page.evaluate(() => document.body.innerText.substring(0, 300));
      console.log(`  Page text: "${pageText.replace(/\n/g, ' | ').substring(0, 200)}"`);
      
      // Check navbar visibility
      const navbarInfo = await page.evaluate(() => {
        const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]') || document.querySelector('header');
        if (!nav) return 'No nav/header found';
        const rect = nav.getBoundingClientRect();
        const style = window.getComputedStyle(nav);
        return `Found: ${Math.round(rect.width)}x${Math.round(rect.height)} at (${Math.round(rect.left)},${Math.round(rect.top)}), display=${style.display}, visibility=${style.visibility}`;
      });
      console.log(`  Navbar: ${navbarInfo}`);
      
      // Check buttons
      const buttonInfo = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, a[role="button"], a.btn, [class*="btn"], input[type="submit"]');
        return Array.from(buttons).map(b => {
          const rect = b.getBoundingClientRect();
          return {
            text: b.innerText?.substring(0, 30) || b.value || b.getAttribute('aria-label') || '',
            visible: rect.width > 0 && rect.height > 0,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        }).filter(b => b.text);
      });
      console.log(`  Buttons found: ${buttonInfo.length}`);
      buttonInfo.forEach(b => {
        console.log(`    - "${b.text}" visible=${b.visible} size=${b.width}x${b.height}`);
      });
      
      // Full page screenshot
      await page.screenshot({ path: `/tmp/qa-${vp.name}-landing-full.png`, fullPage: true });
      console.log(`  Full page screenshot saved`);
      
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
    }
    
    // Test login page at 390px only
    if (vp.name === 'iphone-14-390') {
      console.log(`\n=== Testing ${vp.name} - Login Page ===`);
      try {
        await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `/tmp/qa-${vp.name}-login.png`, fullPage: false });
        console.log(`  Screenshot saved`);
        
        const loginScrollInfo = await page.evaluate(() => {
          const scrollWidth = document.documentElement.scrollWidth;
          const clientWidth = document.documentElement.clientWidth;
          return { scrollWidth, clientWidth, hasHScroll: scrollWidth > clientWidth };
        });
        console.log(`  Horizontal scroll: ${loginScrollInfo.hasHScroll ? 'YES (PROBLEM!)' : 'No'} (scrollWidth=${loginScrollInfo.scrollWidth}, clientWidth=${loginScrollInfo.clientWidth})`);
        
        // Check for two-panel layout (desktop: side by side, mobile: stacked/hidden)
        const layoutInfo = await page.evaluate(() => {
          const body = document.body;
          const children = body.querySelectorAll(':scope > *');
          // Check for flex/grid layouts
          const mainContainer = document.querySelector('main') || document.querySelector('[class*="flex"]') || document.querySelector('[class*="grid"]');
          if (!mainContainer) return 'No main container found';
          
          const style = window.getComputedStyle(mainContainer);
          const rect = mainContainer.getBoundingClientRect();
          
          // Check for hidden elements on mobile
          const hiddenEls = document.querySelectorAll('[class*="hidden"], [class*="md:hidden"], [class*="lg:hidden"]');
          const mdBlock = document.querySelectorAll('[class*="md:flex"], [class*="md:block"], [class*="lg:flex"], [class*="lg:block"]');
          
          return {
            containerDisplay: style.display,
            containerWidth: Math.round(rect.width),
            hiddenCount: hiddenEls.length,
            mdBlockCount: mdBlock.length,
          };
        });
        console.log(`  Layout: ${JSON.stringify(layoutInfo)}`);
        
        // Check form elements
        const formInfo = await page.evaluate(() => {
          const inputs = document.querySelectorAll('input');
          const forms = document.querySelectorAll('form');
          return {
            forms: forms.length,
            inputs: inputs.length,
            inputTypes: Array.from(inputs).map(i => `${i.type}(${i.name || i.placeholder?.substring(0,20) || 'unnamed'})`),
          };
        });
        console.log(`  Form info: ${JSON.stringify(formInfo)}`);
        
      } catch (e) {
        console.log(`  ERROR: ${e.message}`);
      }
      
      // Scroll test on landing page
      console.log(`\n=== Testing ${vp.name} - Landing Page Scroll ===`);
      try {
        await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(2000);
        
        // Get total page height
        const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        console.log(`  Total page height: ${totalHeight}px`);
        
        // Scroll to middle
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 3));
        await page.waitForTimeout(500);
        await page.screenshot({ path: `/tmp/qa-${vp.name}-scroll-mid.png` });
        console.log(`  Mid-scroll screenshot saved`);
        
        // Scroll to bottom
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(500);
        await page.screenshot({ path: `/tmp/qa-${vp.name}-scroll-bottom.png` });
        console.log(`  Bottom-scroll screenshot saved`);
        
        // Check for horizontal scroll at different scroll positions
        const midScrollH = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        const bottomScrollH = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        console.log(`  H-scroll at mid: ${midScrollH ? 'YES' : 'No'}, at bottom: ${bottomScrollH ? 'YES' : 'No'}`);
        
      } catch (e) {
        console.log(`  ERROR: ${e.message}`);
      }
    }
    
    await context.close();
  }
  
  await browser.close();
  console.log('\n=== All tests complete ===');
}

run().catch(console.error);
