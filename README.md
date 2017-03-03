# ndx-gmail
### send email with gmail for [ndx-framework](https://github.com/ndxbxrme/ndx-framework) apps
install with  
`npm install --save ndx-gmail jade`  
## requirements
make a directory in root called `/views` and put your email templates in there  
`views/mail.jade`  
```jade
html
  head
   title= subject
  body
    h1= subject
    p= message
```
## example
`src/server/app.coffee`  
```coffeescript
require 'ndx-server'
.config
  database: 'db'
.use 'ndx-gmail'
.controller (ndx) ->
  ndx.gmail.send
    template: 'mail.jade'
    to: 'email@email.com'
    subject: 'email subject'
    message: 'email message'
  , (err) ->
    if not err
      console.log 'email sent'
```
## environment variables  
|environment|config|description|
|-----------|------|-----------|
|GMAIL_USER |gmailUser|gmail username|
|GMAIL_PASS |gmailPass|gmail password|