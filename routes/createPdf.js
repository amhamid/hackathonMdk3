var PDFDocument = require('pdfkit')
var express = require('express');
var fs = require('fs')
var router = express.Router();
var _ = require('underscore')
var request = require('request')
var path = require('path')
var unirest = require('unirest')

/* GET home page. */
router.post('/', function(req, res, next) {
   // Create a document
   doc = new PDFDocument

   // Pipe it's output somewhere, like to a file or HTTP response
   // See below for browser usage
   doc.pipe(fs.createWriteStream('contract.pdf'))

   var content= 
   '\nProduct name: ' +    req.body.Product +
   '\nWeight in KG: ' +    req.body.Weight +
   '\nValue in US Dollars: ' +    req.body.Value +
   '\nExecution date: ' +    req.body.Date +
   '\n\n\nRequester name: ' + req.body.RequesterName +
   '\nRequester email: ' +    req.body.RequesterEmail 

   var sign1= '\n\n {{signer1}}'

   var content2= 
   '\n\n\nReceiver name: ' +    req.body.ReceiverName +
   '\nReceiver email: ' +    req.body.ReceiverEmail

   var sign2=
   '\n\n {{signer2}} \n'

   doc.fontSize(20)
      .fillColor('black')
      .text(content, 100, 100)
      .fillColor('white')
      .text(sign1)
      .fillColor('black')
      .text(content2)
      .fillColor('white')
      .text(sign2)

   // Finalize PDF file
   doc.end()

   // this will create transaction 
   var postData = {
        'File': {
          'Name': 'contract.pdf'
        },
        'Seal': true,
        'Signers': [
          {
            'Email': req.body.RequesterEmail,
            'Mobile': null,
            'Iban': null,
            'BSN': null,
            'RequireScribbleName': false,
            'RequireScribble': true,
            'RequireEmailVerification': true,
            'RequireSmsVerification': false,
            'RequireIdealVerification': false,
            'RequireDigidVerification': false,
            'RequireKennisnetVerification': false,
            'RequireSurfnetVerification': false,
            'SendSignRequest': true,
            'SendSignConfirmation': null,
            'SignRequestMessage': 'Hello, could you please sign this document? Best regards, IndoVidence',
            'DaysToRemind': 15,
            'Language': 'en-US',
            'ScribbleName': req.body.RequesterName,
            'ScribbleNameFixed': true,
            'Reference': 'Client #123',
            'ReturnUrl': 'http://indovidence.bataviasoft.com',
            'Context': null
          },
          {
            'Email': req.body.ReceiverEmail,
            'Mobile': null,
            'Iban': null,
            'BSN': null,
            'RequireScribbleName': false,
            'RequireScribble': true,
            'RequireEmailVerification': true,
            'RequireSmsVerification': false,
            'RequireIdealVerification': false,
            'RequireDigidVerification': false,
            'RequireKennisnetVerification': false,
            'RequireSurfnetVerification': false,
            'SendSignRequest': true,
            'SendSignConfirmation': null,
            'SignRequestMessage': 'Hello, could you please sign this document? Best regards, IndoVidence',
            'DaysToRemind': 15,
            'Language': 'en-US',
            'ScribbleName': req.body.ReceiverName,
            'ScribbleNameFixed': true,
            'Reference': 'Client #123',
            'ReturnUrl': 'http://indovidence.bataviasoft.com',
            'Context': null
          }
        ],
        'Reference': 'Contract #123',
        'PostbackUrl': 'http://example.com/postback.php',
        'SignRequestMode': 2,
        'DaysToExpire': 30,
        'SendEmailNotifications': true,
        'Context': null
      };
   var options = {
     method: 'post',
     body: postData,
     json: true,
     url: 'https://api-staging.signhost.com/api/transaction',
     headers: {
      'Application': 'APPKey SignHost a9QLKXQvQm7k0JoPJcnkfwYyDzezGbKh',
      'Authorization': 'APIKey 6ss6vTWwAeCRPfHXe3mPhFSzjH5i9Asr',  
      'Accept': '*/*', 
      'Content-Type': 'application/json', 
      'Connection': 'keep-alive' 
     }
   };

   // if creating transaction is successfull then upload file
   request(options, function (err, res, body) {
      var uploadUrl = 'https://api-staging.signhost.com/api/file/' + body.File.Id;
      var options2 = {
        method: 'put',
        url: uploadUrl,
        headers: {
         'Application': 'APPKey SignHost a9QLKXQvQm7k0JoPJcnkfwYyDzezGbKh',
         'Authorization': 'APIKey 6ss6vTWwAeCRPfHXe3mPhFSzjH5i9Asr',  
         'Accept': '*/*', 
         'Content-Type': 'application/pdf', 
         'Connection': 'keep-alive' 
        }
      };

      unirest
         .put(uploadUrl)
         .headers({
            'Application': 'APPKey SignHost a9QLKXQvQm7k0JoPJcnkfwYyDzezGbKh',
            'Authorization': 'APIKey 6ss6vTWwAeCRPfHXe3mPhFSzjH5i9Asr',  
            'Accept': '*/*', 
            'Content-Type': 'application/pdf', 
            'Connection': 'keep-alive' 
           })
         .attach('contract.pdf', path.join(__dirname, '../contract.pdf'))
         .end(function (response) {
            console.log(response.body)
         }) 

      })

  res.render('requestSuccess', { title: 'Request is successfully processed !'});
});

module.exports = router;
