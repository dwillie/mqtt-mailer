# mqtt-mailer

Node app that listens to MQTT queue on specific topic (can be found in `./src/config/config.json`) and processes message to send an email

### Setup Basics
- `git clone https://github.com/dstil/mqtt-mailer.git`
- `npm install`
- `export MAILER_ADDRESS='example@gmail.com'`
- `export MAILER_PWD='yourpassword'`
- `npm start`


### Notes
You can add `export` to `~/.profile` or `~/.bash_profile` to make it set up automatically during start up

`MAILER_ADDRESS` has to be a **GMAIL** account

Expected mqtt message format
```
{
  "receiver": "example@email.com",
  "subject": "Email subject",
  "message": "Your email body"
}
```
Email body can be in html format