const express = require('express');
const router = express.Router();
const pdftk = require('node-pdftk');

router.post('/', async function(req, res) {
  try{
    console.log('PDF Unlock')
    if(!req.files) res.send({
        status: false,
        message: 'No file uploaded'
      });

    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let pdf = req.files.pdf;

    const test = await pdftk.input(pdf.data).output();

    res.contentType("application/pdf");
    res.end(new Buffer(test, 'binary'), 'binary');

  }catch (e) {
    console.error('[API][pdfUnlock][pdfUnlock] An error has occurred when unlocking pdf', e)
    res.status(500).send(e);
  }
});

module.exports = router;
