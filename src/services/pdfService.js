const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

class PDFService {
    async generatePDF(packageData, filename) {
        let browser;
        try {
            const templatePath = path.join(__dirname, '../templates/template1.ejs');
            const html = await ejs.renderFile(templatePath, {
                data: packageData,
            });

            browser = await puppeteer.launch();
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(60000);
            page.setDefaultTimeout(60000);

            page.on('console', (msg) => console.log('Page log:', msg.text()));

            await page.setJavaScriptEnabled(true);

            // Set content and wait longer for scripts
            await page.setContent(html, {
                waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
            });

            const pdf = await page.pdf({
                path: filename, // Corrected usage
                printBackground: true, // Include graphics
                preferCSSPageSize: true,
                headerTemplate:
                    '<span style="font-size:10px;">Generated on: {{date}}</span>',
                footerTemplate:
                    '<span style="font-size:10px;">Page {{pageNumber}} of {{totalPages}}</span>',
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
