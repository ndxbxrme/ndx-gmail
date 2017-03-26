(function() {
  'use strict';
  var mailer;

  mailer = require('express-mailer');

  module.exports = function(ndx) {
    var callbacks, pass, safeCallback, user;
    user = process.env.GMAIL_USER || ndx.settings.GMAIL_USER;
    pass = process.env.GMAIL_PASS || ndx.settings.GMAIL_PASS;
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
    callbacks = {
      send: [],
      error: []
    };
    safeCallback = function(name, obj) {
      var cb, i, len, ref, results;
      ref = callbacks[name];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        cb = ref[i];
        results.push(cb(obj));
      }
      return results;
    };
    return ndx.gmail = {
      send: function(ctx, cb) {
        if (process.env.GMAIL_OVERRIDE) {
          ctx.to = process.env.GMAIL_OVERRIDE;
        }
        if (!process.env.GMAIL_DISABLE) {
          return ndx.app.mailer.send(ctx.template, {
            to: ctx.to,
            subject: ctx.subject,
            context: ctx
          }, function(err, res) {
            if (err) {
              safeCallback('error', err);
            } else {
              safeCallback('send', res);
            }
            return typeof cb === "function" ? cb() : void 0;
          });
        } else {
          console.log('sending email');
          console.log(ctx.to);
          console.log(ctx.subject);
          return console.log(ctx.template);
        }
      }
    };
  };

}).call(this);

//# sourceMappingURL=index.js.map
