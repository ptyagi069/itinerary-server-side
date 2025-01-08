const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

router.post('/preview', pdfController.previewPDF);
router.get('/download/:pkgid', pdfController.downloadPDF);

module.exports = router;