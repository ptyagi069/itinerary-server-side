const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

app.get('/preview', async (req, res) => {
    try {
        const data = {
            title: '',
            content: ''
        };
        res.render('template1', data);
    } catch (error) {
        console.error('Error rendering preview:', error);
        res.status(500).send('Error rendering preview');
    }
});

app.get('/download-pdf', async (req, res) => {
    try {
        const data = {
            title: '',
            content: ''
        };

        const html = await ejs.renderFile(
            path.join(__dirname, 'templates', 'template1.ejs'), 
            data
        );
        
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

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

        await browser.close();

        res.setHeader('Content-Length', pdf.length);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');

        

        res.send(Buffer.from(pdf));

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            error: 'Error generating PDF',
            details: error.message
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something broke!',
        details: err.message
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Preview URL: http://localhost:${PORT}/preview`);
    console.log(`Download PDF URL: http://localhost:${PORT}/download-pdf`);
});