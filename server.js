var request = require("request");
var JSONStream = require("JSONStream");
var es = require("event-stream");
var sockio = require("socket.io");
var express = require("express");
var r = require("rethinkdb");

var config = require("./config");

var app = express();
app.use(express.static(__dirname + "/public"));

var io = sockio.listen(app.listen(config.port, config.host, function(error) {
  if (error) handleError;
  console.log(`App running at ${config.hostname}:${config.port}`)
}));

function handleError(error) {
  console.log("Error:", error);
}

function getStream(table, searchTerms) {
  var oauth = {
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    token: config.twitter.token,
    token_secret: config.twitter.token_secret,
  };
  var qs = { track: searchTerms.join(",") };
  var req = request({
    url: config.twitter.api,
    oauth,
    qs,
    json: true,
  });
  
  req.on('error', handleError);
  req.on('response', function(response) {
    if (response.statusCode !== 200) handleError(response.statusCode);
    response.on('error', handleError);
    
    response.setEncoding('utf8')
            .pipe(JSONStream.parse())
            .on('error', handleError)
            .pipe(es.mapSync(function (tweet) {
              var img = parseTweet(tweet);
              if (img) {
                addPhoto(table, img.id, img.src, img.url);
              }
            }))
            .on('error', handleError);
  });
}

function parseTweet(tweet) {
  var hasImg = !!(tweet.entities &&
                  tweet.entities.media &&
                  tweet.entities.media[0].media_url_https);
  var nsfw = tweet.possibly_sensitive;
  
  if (hasImg && !nsfw) {
    var url = tweet.entities.media[0].url;
    var media_url = tweet.entities.media[0].media_url_https;
    var id = tweet.entities.media[0].id;
    var src = /media/.test(media_url) ? media_url : "";
  }
  
  return !!(hasImg && !nsfw && src && url) ? { id, src, url } : false;
}


function addPhoto(table, id, imgSrc, url) {
  r.connect(config.database).then(function(c) {
    this.conn = c;
    return r.table(table).insert(
    {
      id,
      createdAt: r.now(),
      updatedAt: r.now(),
      imgSrc,
      url,
      repeats: 0,
    },
    {
      conflict: function(id, oldDoc, newDoc) {
        return oldDoc.merge({
          repeats: oldDoc('repeats').add(1),
          updatedAt: r.now(),
        });
      }
    }).run(conn)
  })
  .error(handleError)
  .finally(function() {
    this.conn.close();
  })
}

var conn;
r.connect(config.database).then(function(c) {
  conn = c;
  return r.dbCreate(config.database.db).run(conn);
})
.then(function() {
  return r.tableCreate(config.database.table).run(conn);
})
.then(function() {
  return r.table(config.database.table).indexCreate("repeats").run(conn);
})
.error(function(err) {
  if (err.msg.indexOf("already exists") == -1)
    handleError(err);
})
.finally(function() {
  r.table(config.database.table)
   .changes()
   .run(conn)
  .then(function(cursor) {
    cursor.each(function(err, item) {
      if (err) handleError;
      if (item && item.new_val) {
        var lastTimeTweeted = item.old_val &&
                              item.new_val.updatedAt - item.old_val.updatedAt;
        if (lastTimeTweeted >= 300000 || !lastTimeTweeted)
          io.sockets.emit("photo", item.new_val.imgSrc);
      }
    });
  })
  .error(handleError)
  
  getStream(config.database.table, config.searchTerms);
});


io.sockets.on('connection', function(socket) {
  r.connect(config.database).then(function(conn) {
    this.conn = conn;
    return r.table(config.database.table)
            .orderBy({ index: r.desc("repeats") })
            .limit(50)
            .sample(20)
            .getField("imgSrc")
            .run(conn);
  })
  .then(function(cursor) {
    return cursor.toArray();
  })
  .then(function(result) {
    socket.emit("recent", result);
  })
  .error(handleError)
  .finally(function() {
    if (this.conn)
      this.conn.close();
  });
});