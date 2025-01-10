const fs = require('fs'); 
const packageService = require('../services/packageService');
const pdfService = require('../services/pdfService');

class PDFController {
    async previewPDF(req, res) {
        try {
            const { pkgid } = req.params;
            const { userid, date } = req.query; 
            const packageData = await packageService.getPackageData(pkgid, userid, date);
            
            const safePackageData = JSON.stringify(packageData)
                .replace(/</g, '\\u003c')
                .replace(/>/g, '\\u003e')
                .replace(/&/g, '\\u0026')
                .replace(/'/g, '\\u0027')
                .replace(/"/g, '\\"');
    
            res.render('template1', {
                data: safePackageData
            });
    
        } catch (error) {
            console.error('Preview PDF error:', error);
            res.status(500).json({ error: 'Failed to generate preview' });
        }
    }
    
    async downloadPDF(req, res) {
        try {
            const { pkgid } = req.params;
            const { userid, date } = req.query;
            const packageData = await packageService.getPackageData(pkgid, userid, date);
            
            fs.writeFileSync(
                './debug-packageData-download.txt',
                JSON.stringify(packageData, null, 4),
                'utf-8'
            );

            const pdf = await pdfService.generatePDF(packageData);

            res.setHeader('Content-Length', pdf.length);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="package-${pkgid}.pdf"`);
            res.send(Buffer.from(pdf));
        } catch (error) {
            console.error('Download PDF error:', error);
            res.status(500).json({ error: 'Failed to generate PDF' });
        }
    }
}

module.exports = new PDFController();