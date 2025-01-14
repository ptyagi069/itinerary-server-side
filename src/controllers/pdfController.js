const packageService = require('../services/packageService');
const pdfService = require('../services/pdfService');

class PDFController {
    async previewPDF(req, res) {
        try {
            const { pkgid } = req.params;
            const { userid, date ,addonswcost} = req.query; 
            console.log(pkgid, userid, date, addonswcost);
            const packageData = await packageService.getPackageData(pkgid, userid, date ,  addonswcost);
            require('fs').writeFileSync('./data-dummy.txt', JSON.stringify({ data: packageData }));
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
            const { userid, date ,addonswcost } = req.query; 
            const packageData = await packageService.getPackageData(pkgid, userid, date , addonswcost);
            const pdf = await pdfService.generatePDF(packageData, pkgid);
            const packagename = packageData.packageInfo.packageName;
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename= "${packagename}.pdf"`, 
            });
            
            res.end(pdf);
        } catch (error) {
            console.error('Download PDF error:', error);
            res.status(500).json({ error: 'Failed to generate PDF' });
        }
    }
}

module.exports = new PDFController();