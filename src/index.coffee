'use strict'
mailer = require 'express-mailer'

module.exports = (ndx) ->
  user = process.env.GMAIL_USER or ndx.settings.GMAIL_USER
  pass = process.env.GMAIL_PASS or ndx.settings.GMAIL_PASS
  fillTemplate = (template, data) ->
    template.replace /\{\{(.+?)\}\}/g, (all, match) ->
      evalInContext = (str, context) ->
        (new Function("with(this) {return #{str}}"))
        .call context
      evalInContext match, data
  callbacks = 
    send: []
    error: []
  safeCallback = (name, obj) ->
    for cb in callbacks[name]
      cb obj
  if user and pass
    mailer.extend ndx.app,
      from: user
      host: 'smtp.gmail.com'
      secureConnection: false
      port: 465
      transportMethod: 'SMTP'
      auth:
        user: user
        pass: pass
  ndx.gmail =
    send: (ctx, cb) ->
      if user and pass
        console.log 'sending', user, pass
        if process.env.GMAIL_OVERRIDE
          ctx.to = process.env.GMAIL_OVERRIDE
        console.log 'to', ctx.to
        if not process.env.GMAIL_DISABLE
          console.log 'i want to send'
          ndx.app.mailer.send ctx.template,
            to: ctx.to
            subject: fillTemplate ctx.subject, ctx
            context: ctx
          , (err, res) ->
            console.log err, res
            if err
              safeCallback 'error', err
            else
              safeCallback 'send', res
            cb? err, res
        else
          console.log 'sending email disabled'
      else
        console.log 'missing gmail info'
        cb? 'no user'