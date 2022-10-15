$(document).ready(function() {

  //this sequence hides the tweet submission, reveals it when the arrow is click and moves the cursor to the area
  $('#submit-new-tweet').hide();
  $('#arrow').on('click', (event) => {
    $('#submit-new-tweet').slideToggle();
    $('#tweet-text').focus();
  });

  loadTweets();

  //grab the tweet container and store in jquery variable to be used in once page loads
  const $tweets = ('.tweets');
  const $form = $('#submit-new-tweet');
  
  const $errorContainer = $('.error');
  $errorContainer.hide();

  $form.on('submit', (event) => {
    event.preventDefault();

    //error for empty tweet
    if ($form.serialize() === 'text=') {
      $('#error-msg').text("You forgot to enter a tweet!")
      $errorContainer.slideDown(2500);
      $errorContainer.slideUp(1000);
      return;
    }

    //error for too many characters
    if ($form.serialize().length - 5 > 140) {
      $errorContainer.slideDown(2500);
      $('#error-msg').text("You tweet is too damn long!");
      $errorContainer.slideUp(1000);
      return;
    }

    const newTweetData = $form.serialize();
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: newTweetData
    })
    .then(() => {
      loadTweets()
      $('textarea').val("")
    })
    .catch((err) => {
      console.log(err)
    })
  })
});


const loadTweets = function () {
  $.ajax({
    url: '/tweets',
    method: 'GET'
  })
  .then((tweets) => {
    renderTweets(tweets);
  })
  .catch((err) => {
    console.log(err);
  })
};

//function to change the submitted tweet into "Safe Text"
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function (data) {
  const tweetTime = timeago.format(data.created_at); 
  const tweetBody = escape(data.content.text);
  const result = `<article><header><span class="topTweetLine"><span class="tweeter-name"><img src="/images/profile-hex.png"><p>${data.user.name}</p></span><p>${data.user.handle}</p></span><p>${tweetBody}</p></header><footer class="tweetFeet"><span><h5>${tweetTime}</h5></span><span class="icons"><i class="fa-solid fa-flag"></i><i class="fa-solid fa-heart"></i><i class="fa-solid fa-retweet"></i></span></footer></article>`
  return result;
};

const renderTweets = function (tweets) {
  for (let tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('.tweets').prepend($tweet);
  }
};

