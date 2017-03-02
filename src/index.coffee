'use strict'

module.exports = (ndx) ->
  user = process.env.GMAIL_USER or ndx.settings.GMAIL_USER
  pass = process.env.GMAIL_PASS or ndx.settings.GMAIL_PASS
  mailer = require 'express-mailer'
  mailer.extend ndx.app,
    from: user
    host: 'smtp.gmail.com'
    secureConnection: true
    port: 465
    transportMethod: 'SMTP'
    auth:
      user: user
      pass: pass
  ndx.gmail =
    send: (ctx, cb) ->
      ndx.app.mailer.send ctx.template,
        to: ctx.to
        subject: ctx.subject
        context: ctx
      , cb