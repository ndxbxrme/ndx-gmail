(function() {
  'use strict';
  module.exports = function(ndx) {
    var mailer, pass, user;
    user = process.env.GMAIL_USER || ndx.settings.GMAIL_USER;
    pass = process.env.GMAIL_PASS || ndx.settings.GMAIL_PASS;
    mailer = require('express-mailer');
    mailer.extend(ndx.app, {
      from: user,
      host: 'smtp.gmail.com',
      secureConnection: true,
      port: 465,
      transportMethod: 'SMTP',
      auth: {
        user: user,
        pass: pass
      }
    });
    return ndx.gmail = {
      send: function(ctx, cb) {
        return ndx.app.mailer.send(ctx.template, {
          to: ctx.to,
          subject: ctx.subject,
          context: ctx
        }, cb);
      }
    };
  };

}).call(this);

//# sourceMappingURL=index.js.map
