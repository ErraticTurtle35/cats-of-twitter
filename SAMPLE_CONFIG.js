module.exports =  {
  searchTerms : [
    "#catsofinstagram",
    "#catsoftwitter",
    "#catstagram",
    "#fluffyfursday",
  ],
  
  twitter: {
    api: "https://stream.twitter.com/1.1/statuses/filter.json",
    consumer_key: "XXXXXXXXXXXXXXXXXXXXXXXXX",
    consumer_secret: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    token: 	"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    token_secret: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  },

  database: {
    host: "localhost", // Your db hostname (probably 127.0.0.1 or "localhost")
    port: 28015,
    db: "twitter_cats",
    table: "photos",
  },

  host: "localhost",
  port: 3000,
  hostname: "http://localhost",
}