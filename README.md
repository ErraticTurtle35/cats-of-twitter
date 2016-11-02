# Cats Of Twitter
### Node.js/RethinkDB/Socket.io app that uses the Twitter streaming API to show cat pictures in realtime

To run:

 - [Create a new app](https://apps.twitter.com/app/new) under your Twitter account.
 
 ```bash
$ git clone http://github.com/brettapeters/cats-of-twitter.git
$ cd cats-of-twitter
$ cp SAMPLE_CONFIG.js config.js
```
 - Fill in `consumer_key, consumer_secret, token, token_secret` with info from your new Twitter app.

```bash
$ npm install
$ rethinkdb
$ node server.js
```
