/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
//function to change the submitted tweet into "Safe Text"

const createTweetElement = function (data) {
  const tweetTime = timeago.format(data.created_at); 
  const tweetBody = escape(data.content.text)
  const result = `<article><header><span class="topTweetLine"><span class="tweeter-name"><img src="/images/profile-hex.png"><p>${data.user.name}</p></span><p>${data.user.handle}</p></span><p>${tweetBody}</p></header><footer class="tweetFeet"><span><h5>${tweetTime}</h5></span><span class="icons"><i class="fa-solid fa-flag"></i><i class="fa-solid fa-heart"></i><i class="fa-solid fa-retweet"></i></span></footer></article>`
  return result;
};

const renderTweets = function (tweets) {
  for (let tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('.tweets').prepend($tweet);
  }
};

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


$(document).ready(function() {
  
 
  $('#submit-new-tweet').hide();

  $('#arrow').on('click', (event) => {
    $('#submit-new-tweet').slideToggle();

  });

  loadTweets();

  //grab the tweet container and store in jquery variable
  const $tweets = ('.tweets');

  const $form = $('#submit-new-tweet');
  
  const $errorContainer = $('.error1');
  //selects the div element containing all the error html

 

  $form.on('submit', (event) => {
    event.preventDefault();
    if ($form.serialize() === 'text=') {
      $('.error1').attr('class', 'error2'); 
      //adds a class to the error container for styling

      $errorContainer.slideDown(500);
      $('#error-msg').text("You forgot to enter a tweet!")
      
      return;
    }
    if ($form.serialize().length - 5 > 140) {
      $('#error-msg').text("You tweet is too damn long!");
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

