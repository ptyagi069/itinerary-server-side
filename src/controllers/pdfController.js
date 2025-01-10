const packageService = require('../services/packageService');
const pdfService = require('../services/pdfService');

class PDFController {
    async previewPDF(req, res) {
        try {
            const { pkgid } = req.params;
            const { userid, date } = req.query; 
            const packageData = await packageService.getPackageData(pkgid, userid, date);
            res.render('template1', {
                data: packageData
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
            
            const pdf = await pdfService.generatePDF(packageData);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=package-${pkgid}.pdf`);
            res.setHeader('Content-Length', pdf.length);
            
            res.send(pdf);
        } catch (error) {
            console.error('Download PDF error:', error);
            res.status(500).json({ error: 'Failed to generate PDF' });
        }
    }
}

module.exports = new PDFController();