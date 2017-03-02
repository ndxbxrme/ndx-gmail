(function() {
  'use strict';
  var google, key;

  google = require('googleapis');

  key = require('../VS-Conveyancing-Mailer-3ee4b02b69a2.json');

  module.exports = function(ndx) {
    var jwtClient;
    jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, ['https://mail.google.com/'], 'jayne@vitalspace.co.uk');
    return jwtClient.authorize(function(err, tokens) {
      var gmail, message, raw, sendRequest;
      console.log(tokens);
      if (err) {
        console.log(err);
        return;
      }
      message = 'To:lewis_the_cat@hotmail.com\r\nSubject:test email\r\nhey there';
      raw = new Buffer(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
      gmail = google.gmail({
        version: 'v1',
        auth: jwtClient
      });
      return sendRequest = gmail.users.messages.send({
        userId: 'Jayne@vitalspace.co.uk',
        resource: {
          raw: raw
        }
      }, function(err, res) {
        return console.log(err, res);
      });
    });
  };

}).call(this);

//# sourceMappingURL=index.js.map
