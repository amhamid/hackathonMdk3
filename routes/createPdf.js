var PDFDocument = require('pdfkit')
var express = require('express');
var fs = require('fs')
var router = express.Router();
var spawn = require('child_process').spawn;
var _ = require('underscore')

/* GET home page. */
router.post('/', function(req, res, next) {
   // Create a document
   doc = new PDFDocument

   // Pipe it's output somewhere, like to a file or HTTP response
   // See below for browser usage
   doc.pipe(fs.createWriteStream('contract.pdf'))

   var content= 
   'Requester name: ' + req.body.RequesterName +
   '\nRequester email: ' +    req.body.RequesterEmail +
   '\nReceiver name: ' +    req.body.ReceiverName +
   '\nReceiver email: ' +    req.body.ReceiverEmail +
   '\nProduct name: ' +    req.body.Product +
   '\nWeight in KG: ' +    req.body.Weight +
   '\nValue in US Dollars: ' +    req.body.Value +
   '\nExecution date: ' +    req.body.Date 

   doc.fontSize(20)
      .text(content, 100, 100)

   // Finalize PDF file
   doc.end()

   // this will create transaction 
   var digitalSignSh = spawn('bash', [ 'create-transaction.sh', req.body.RequesterName, 
                                                                req.body.RequesterEmail,
                                                                req.body.ReceiverName,
                                                                req.body.ReceiverEmail], {
      cwd: process.env.HOME + '/dev/digiSign',
      env:_.extend(process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
   });

   digitalSignSh.stdout.on('data', function (data) {
      var parsedData = JSON.parse(data)

      var uploadFileSh = spawn('bash', [ 'upload-file.sh', parsedData.File.Id], {
         cwd: process.env.HOME + '/dev/digiSign',
         env:_.extend(process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
      });

      uploadFileSh.stdout.on('data', function (data) {
         console.log('stdout: ' + data);
      });

      uploadFileSh.stderr.on('data', function (data) {
         console.log('stderr: ' + data);
      });

      uploadFileSh.on('close', function (code) {
         console.log('child process exited with code ' + code);
      });

      console.log('stdout: ' + data);   
   });

   digitalSignSh.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
   });

   digitalSignSh.on('close', function (code) {
      console.log('child process exited with code ' + code);
   });

  res.render('requestSuccess', { title: digitalSignSh });
});

module.exports = router;
