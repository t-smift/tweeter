$(document).ready(function() {
  const $newTweet = $('.new-tweet textarea');
  

  $newTweet.on('input', (event) => {
    let count = event.target.value.length;
    let updatedCount = 140 - count;
    $('.new-tweet output').text(updatedCount);
    if (updatedCount <= 0) {
      $('.new-tweet output').attr('class', 'tooMany');
    } else {
      $('.new-tweet output').removeClass('tooMany');
    }
  })
  

});