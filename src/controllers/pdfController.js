const fs = require('fs'); 
const packageService = require('../services/packageService');
const pdfService = require('../services/pdfService');

class PDFController {
    async previewPDF(req, res) {
        try {
            const { pkgid, userid, date } = req.body;
            const packageData = await packageService.getPackageData(pkgid, userid, date);

            fs.writeFileSync(
                './debug-packageData.txt',
                JSON.stringify(packageData, null, 4),
                'utf-8'
            );

            console.log(packageData);
            res.render('template1', packageData);
        } catch (error) {
            console.log(error);
            // next(error); // Uncomment this if you have global error handling
        }
    }

    async downloadPDF(req, res) {
        try {
            const { pkgId } = req.params;
            const packageData = await packageService.getPackageData(pkgId);
            const pdf = await pdfService.generatePDF(packageData);

            // Write the JSON data to a text file for debugging
            fs.writeFileSync(
                './debug-packageData-download.txt',
                JSON.stringify(packageData, null, 4),
                'utf-8'
            );

            res.setHeader('Content-Length', pdf.length);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="package-${pkgId}.pdf"`);
            res.send(Buffer.from(pdf));
        } catch (error) {
            console.log(error);
            // next(error); // Uncomment this if you have global error handling
        }
    }
}

module.exports = new PDFController();
