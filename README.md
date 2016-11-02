# Cats Of Twitter
### Node.js/RethinkDB/Socket.io app that uses the Twitter streaming API to show cat pictures in realtime

To run:
- [Install RethinkDB](https://www.rethinkdb.com/docs/install/) if you don't already have it installed.
- [Create a new app](https://apps.twitter.com/app/new) under your Twitter account.
- Generate an access token for your app.
 
 ```bash
$ git clone http://github.com/brettapeters/cats-of-twitter.git
$ cd cats-of-twitter
$ mv SAMPLE_CONFIG.js config.js
```
- Open `config.js` in your text editor.
- Fill in `consumer_key, consumer_secret, token, token_secret` with info from your new Twitter app.
- Change `host`, `port`, and `hostname` if needed.

```bash
$ npm install
$ rethinkdb &
$ node server.js
```

- Cats will magically appear.
