#!/bin/bash

requesterName=$1
requesterEmail=$2
receiverName=$3
receiverEmail=$4

 curl -H 'Application: APPKey SignHost a9QLKXQvQm7k0JoPJcnkfwYyDzezGbKh' \
      -H 'Authorization: APIKey 6ss6vTWwAeCRPfHXe3mPhFSzjH5i9Asr'  \
      -H 'Accept: */*' \
      -H 'Content-Type: application/json' \
      -H 'Connection: keep-alive' \
      https://api-staging.signhost.com/api/transaction -XPOST \
      --data "
{
  'File': {
    'Name': 'contract.pdf'
  },
  'Seal': true,
  'Signers': [
    {
      'Email': '$requesterEmail',
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
      'ScribbleName': '$requesterName',
      'ScribbleNameFixed': false,
      'Reference': 'Client #123',
      'ReturnUrl': 'http://signhost.com',
      'Context': null
    },
    {
      'Email': '$receiverEmail',
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
      'ScribbleName': '$requesterName',
      'ScribbleNameFixed': false,
      'Reference': 'Client #123',
      'ReturnUrl': 'http://signhost.com',
      'Context': null
    }
  ],
  'Reference': 'Contract #123',
  'PostbackUrl': 'http://example.com/postback.php',
  'SignRequestMode': 2,
  'DaysToExpire': 30,
  'SendEmailNotifications': true,
  'Context': null
}"
