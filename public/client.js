window.onload = function() {
  var catContainer = document.getElementById("cat-container");
  var msnry = new Masonry(catContainer, {
                    itemSelector: ".cat-img",
                    columnWidth: ".grid-sizer",
                    percentPosition: true,
                    stagger: 30
                  });
                  
  var socket = io.connect();
  
  socket.on('recent', function(imgList) {
    var fragment = document.createDocumentFragment();
    var cats = imgList.map(function(imgSrc) {
      var cat = createCat(imgSrc);
      fragment.appendChild(cat);
      return cat;
    });
    
    catContainer.classList.add("loading");
    catContainer.appendChild(fragment);
    
    imagesLoaded(catContainer, function() {
      catContainer.classList.remove("loading");
      msnry.appended(cats);
      msnry.layout();
    });
  });

  socket.on('photo', function(imgSrc) {
    var cat = createCat(imgSrc)
    catContainer.insertBefore(cat, catContainer.firstChild);
    imagesLoaded(catContainer, function() {
      msnry.prepended(cat);
    });
  });
  
  function createCat(imgSrc) {
    var catImg = document.createElement("img");
    catImg.src = imgSrc;
    catImg.classList.add("cat-img");
    return catImg;
  }
};
