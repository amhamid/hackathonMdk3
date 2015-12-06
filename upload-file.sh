#!/bin/bash

fileId=$1

 curl -H 'Application: APPKey SignHost a9QLKXQvQm7k0JoPJcnkfwYyDzezGbKh' \
      -H 'Authorization: APIKey MOnvOAVTK14D46YeuHaSb9SeochIpSVT'  \
      -H 'Accept: */*' \
      -H 'Content-Type: application/pdf' \
      -H 'Connection: keep-alive' \
      https://api-staging.signhost.com/api/file/$fileId -XPUT \
      -F filedata=@contract.pdf