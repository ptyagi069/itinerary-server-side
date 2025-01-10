const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

class PDFService {
    async generatePDF(data) {
        let browser;
        try {
            const templatePath = path.join(__dirname, '../templates/template1.ejs');
            const html = await ejs.renderFile(templatePath, data);

            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                defaultViewport: {
                    width: 1024,
                    height: 768
                }
            });
            
            const page = await browser.newPage();
            
            // For debugging - log console messages from the page
            page.on('console', msg => console.log('Page log:', msg.text()));
            
            await page.setJavaScriptEnabled(true);
            
            // Set content and wait longer for scripts
            await page.setContent(html, {
                waitUntil: ['networkidle0', 'load', 'domcontentloaded']
            });

            // Give more time for scripts to execute
            await page.waitForTimeout(6000);

            // Debug: Save screenshot
            await page.screenshot({
                path: 'debug-screenshot.png',
                fullPage: true
            });

            const finalHtml = await page.content();
            require('fs').writeFileSync('debug-final.html', finalHtml);

            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                },
                preferCSSPageSize: true
            });

            return pdf;
        } catch (error) {
            console.error('PDF generation error:', error);
            throw error;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

module.exports = new PDFService();