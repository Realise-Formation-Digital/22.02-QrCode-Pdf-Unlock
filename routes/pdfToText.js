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
    let referenceNumberRaw = null
    let referenceNumberArray = null
    let addressNumberComposed = null
    let amountRaw = null
    let amount = null
    let halfString = null
    let extractedAddressNumber = null
    let lastWord = null
    let lastWordOnly = null
    const regExToExtractReference = /([0-9]{13}>[0-9]{27}[+][ ][0-9]{9}>)/g
    const regExToExtractNumber = /([0-9]+)/g
    const regexNumber = /([0-9]+)/g
    const regexSpaces = /([a-z]+)/gi

    if(!req.files) res.send({
      status: false,
      message: 'No file uploaded'
    });
    pdfToTranslate = req.files.pdf

    textFromPDFRaw = await pdfParse(pdfToTranslate)
    textFromPDF = textFromPDFRaw.text

    arrayListFromText = textFromPDF.split('\n')
    npaAndCity = arrayListFromText[25].split(' ')
    referenceNumberRaw = textFromPDF.match(regExToExtractReference)
    referenceNumberArray = referenceNumberRaw[0].match(regExToExtractNumber)
    amountRaw = referenceNumberArray[0].substring(2, 12)
    amount = amountRaw.slice(0,8) + '.' + amountRaw.slice(-2)

    halfString = arrayListFromText[26].slice(arrayListFromText[26].length / 2)
    extractedAddressNumber = halfString.match(regexNumber).pop()
    addressNumberComposed = extractedAddressNumber
    lastWord = arrayListFromText[26].split(' ').pop();
    lastWordOnly = lastWord.match(regexSpaces)
    if (extractedAddressNumber !== lastWord) addressNumberComposed = extractedAddressNumber + ' ' + lastWordOnly

    response = {
      name: arrayListFromText[17],
      infoSupp: arrayListFromText[19],
      npa: npaAndCity[0],
      city: npaAndCity[1],
      address: arrayListFromText[26].slice(0, arrayListFromText[26].length  - extractedAddressNumber.length),
      addressNumber: addressNumberComposed,
      referenceNumber: referenceNumberArray[1],
      totalAmount: parseFloat(amount)
    }

    res.send(response)

  }catch (e) {
    console.error('[API][pdfToText][pdfToText] An error has occurred when trying to translate pdf to text', e)
    res.status(500).send(e);
  }
});

module.exports = router;
