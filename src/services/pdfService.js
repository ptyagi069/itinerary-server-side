const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

class PDFService {

    3
    async generatePDF(packageData, filename) {
        let browser;
        try {
            const templatePath = path.join(__dirname, '../templates/template1.ejs');
            const html = await ejs.renderFile(templatePath, {
                data: packageData,
            });
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(60000);
            page.setDefaultTimeout(60000);
          
            // Set content to the HTML file
            await page.setContent(html, { waitUntil: 'networkidle0' });
          
            // Generate PDF from the HTML content
            const pdf = await page.pdf({
            //   path: `itinerary.pdf`, 
              printBackground: true, //Include graphics
              preferCSSPageSize: true,
              format : "A4"
            });
          
            await browser.close();
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
