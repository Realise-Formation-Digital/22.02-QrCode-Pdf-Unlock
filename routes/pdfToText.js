const express = require('express');
const pdfParse = require("pdf-parse");
const router = express.Router();

router.post('/', async function(req, res) {
  try{
    let pdfToTranslate = null
    let textFromPDFRaw = null
    let textFromPDF = null
    let arrayListFromText = null
    let npaAndCity = null
    let response = null
    let addressAndNumber = null
    let referenceNumberRaw = null
    let referenceNumberArray = null
    const regExToExtractReference = /([0-9]{13}>[0-9]{27}[+][ ][0-9]{9}>)/g
    const regExToExtractNumber = /([0-9]+)/g
    const regExToExtractAmount = /^.{2}([0-9]{10})/g

    console.log('PDF To Text')
    if(!req.files) res.send({
      status: false,
      message: 'No file uploaded'
    });
    pdfToTranslate = req.files.pdf

    textFromPDFRaw = await pdfParse(pdfToTranslate)
    textFromPDF = textFromPDFRaw.text

    arrayListFromText = textFromPDF.split('\n')
    npaAndCity = arrayListFromText[25].split(' ')
    addressAndNumber = arrayListFromText[26].split(' ')
    referenceNumberRaw = textFromPDF.match(regExToExtractReference)
    referenceNumberArray = referenceNumberRaw[0].match(regExToExtractNumber)
    console.log('text', referenceNumberArray,  referenceNumberArray[0].substring(1, 1))
    console.log('text', referenceNumberArray[0].substring(2, 12))
    const test = referenceNumberArray[0].substring(2, 12)
    console.log('ciao', test.slice(-2), test.slice(0,10))
    const amount = test.slice(0,10) + '.' + test.slice(-2)
    console.log('ciao', amount)
    response = {
      name: arrayListFromText[17],
      infoSupp: arrayListFromText[19],
      npa: npaAndCity[0],
      city: npaAndCity[1],
      address: arrayListFromText[26],
      addressNumber: addressAndNumber[addressAndNumber.length - 1],
      referenceNumber: referenceNumberArray[1],
      totalAmount: parseFloat(test)
    }

    res.send(response)

  }catch (e) {
    console.error('[API][pdfToText][pdfToText] An error has occurred when trying to translate pdf to text', e)
    res.status(500).send(e);
  }
});

module.exports = router;
