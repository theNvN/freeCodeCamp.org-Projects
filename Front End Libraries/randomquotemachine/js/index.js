let colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];

let quotesData;
let currentQuote = "";
let currnetAuthor = "";

function getQuotes() {
  return $.ajax({
    headers: {
      Accept: "application/json" },

    url: 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json',
    success: function (jsonQuotes) {
      if (typeof jsonQuotes === 'string') {
        quotesData = JSON.parse(jsonQuotes);
      }
    } });

}

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function setRandomQuote() {
  let quoteUnit = quotesData.quotes[Math.floor(Math.random() * quotesData.quotes.length)];

  $("#quote-unit").animate(
  { opacity: 0 },
  500,
  function () {
    $("#text").text(quoteUnit.quote);
    $("#author").text("- " + quoteUnit.author);
    $(this).animate({ opacity: 1 }, 500);
  });


  let randomColor = getRandomColor();

  $("html body").animate(
  {
    backgroundColor: randomColor,
    color: randomColor },

  500);


  $("#new-quote").animate(
  { backgroundColor: randomColor },
  500);


  $("#tweet-quote").attr("href", 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + quoteUnit.quote + '" ' + quoteUnit.author));

  $('#tumblr').attr('href', 'https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=' + encodeURIComponent(quoteUnit.author) + '&content=' + encodeURIComponent(quoteUnit.quote) + '&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button');
}

$("#new-quote").on("click", function () {
  setRandomQuote();
});

$(document).ready(function () {
  getQuotes().then(() => setRandomQuote());
});