const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

class PDFService {
    async generatePDF(data) {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        try {
            const html = await ejs.renderFile(
                path.join(__dirname, '../templates/template1.ejs'),
                data
            );

            const page = await browser.newPage();
            await page.setContent(html, {
                waitUntil: ['networkidle0', 'domcontentloaded'],
                timeout: 30000
            });

            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true
            });

            return pdf;
        } finally {
            await browser.close();
        }
    }
}

module.exports = new PDFService();