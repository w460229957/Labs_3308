var currentPage = 1;
function makeApiCall() {
  var perPage = document.getElementById("perPage");
  var filter = document.getElementById("filter");
  // https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=6059aa8e1a79a419814fcd9abb4efa7a&tags=1&format=json
  var url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=6059aa8e1a79a419814fcd9abb4efa7a&format=json&nojsoncallback=1&per_page=${perPage.value}&page=${currentPage}&tags=${filter.value}&privacy_filter=1&safe_search=1`;

  var content = document.getElementById("content");
  content.removeEventListener("scroll", pollScroll);
  content.addEventListener("scroll", pollScroll);

  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      res.photos.photo.forEach((img) => {
        var card = document.createElement("div");
        var imgTitle = document.createElement("h5");
        var cardBody = document.createElement("div");
        var displayImg = document.createElement("img");
        card.className = "card";
        card.style.width = "18rem";
        card.style.display = "inline-block";
        card.style.margin = "0 10px 10px 0";
        cardBody.className = "card-body";
        imgTitle.className = "card-title";
        imgTitle.innerHTML = img.title;
        displayImg.className = "card-img-top";
        displayImg.src = `https://live.staticflickr.com/${img.server}/${img.id}_${img.secret}_w.jpg`;
        card.appendChild(displayImg);
        card.appendChild(cardBody);
        cardBody.appendChild(imgTitle);
        content.appendChild(card);
      });
    });
}

function pollScroll() {
  var content = document.getElementById("content");
  nScrollHight = content.scrollHeight;
  nScrollTop = content.scrollTop;
  if (nScrollTop + parseInt(content.style.height) >= nScrollHight) {
    makeApiCall();
  }
}
