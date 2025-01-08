const packageService = require('../services/packageService');
const pdfService = require('../services/pdfService');

class PDFController {
    async previewPDF(req, res) {
        try {
            const pkgid = req.body.pkgid; 
            const userid = req.body.userid;
            const date = req.body.date;
            const packageData = await packageService.getPackageData(pkgid , userid , date);
            
            const templateData = {
                title: '',
                content: ''
            };
            
            res.render('template1', templateData);
        } catch (error) {
            // next(error);
            console.log(error);
        }
    }

    async downloadPDF(req, res) {
        try {
            const { pkgId } = req.params;
            const packageData = await packageService.getPackageData(pkgId);
            const pdf = await pdfService.generatePDF(packageData);
            


            res.setHeader('Content-Length', pdf.length);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="package-${pkgId}.pdf"`);
            res.send(Buffer.from(pdf));
        } catch (error) {
            console.log(error);
           // next(error);
        }
    }
}

module.exports = new PDFController();