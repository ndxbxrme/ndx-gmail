(function() {
  'use strict';
  var mailer;

  mailer = require('express-mailer');

  module.exports = function(ndx) {
    var callbacks, fillTemplate, pass, safeCallback, user;
    user = process.env.GMAIL_USER || ndx.settings.GMAIL_USER;
    pass = process.env.GMAIL_PASS || ndx.settings.GMAIL_PASS;
    fillTemplate = function(template, data) {
      return template.replace(/\{\{(.+?)\}\}/g, function(all, match) {
        var evalInContext;
        evalInContext = function(str, context) {
          return (new Function("with(this) {return " + str + "}")).call(context);
        };
        return evalInContext(match, data);
      });
    };
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
    if (user && pass) {
      mailer.extend(ndx.app, {
        from: user,
        host: 'smtp.gmail.com',
        secureConnection: true,
        port: 465,
        transportMethod: 'SMTP',
        auth: {
          user: user,
          pass: pass
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });
    }
    return ndx.gmail = {
      send: function(ctx, cb) {
        if (user && pass) {
          console.log('sending', user, pass);
          if (process.env.GMAIL_OVERRIDE) {
            ctx.to = process.env.GMAIL_OVERRIDE;
          }
          console.log('to', ctx.to);
          if (!process.env.GMAIL_DISABLE) {
            return ndx.app.mailer.send(ctx.template, {
              to: ctx.to,
              subject: fillTemplate(ctx.subject, ctx),
              context: ctx
            }, function(err, res) {
              console.log(err, res);
              if (err) {
                safeCallback('error', err);
              } else {
                safeCallback('send', res);
              }
              return typeof cb === "function" ? cb(err, res) : void 0;
            });
          } else {
            console.log('sending email');
            console.log(ctx.to);
            console.log(ctx.subject);
            return console.log(ctx.template);
          }
        } else {
          console.log('missing gmail info');
          return typeof cb === "function" ? cb('no user') : void 0;
        }
      }
    };
  };

}).call(this);

//# sourceMappingURL=index.js.map
