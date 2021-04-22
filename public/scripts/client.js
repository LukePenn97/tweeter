/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

jQuery(document).ready(function() {

  // render all tweets stored in server
  const renderTweets = function(tweets) {
    $("#tweets").empty();
    $.each(tweets, function(index){
      $("#tweets").prepend(createTweetElement(tweets[index]));
    });
  }

  // avoid user code inputs with escape
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // layout html structure for tweet and put data in
  const createTweetElement = function(tweetObj) {
    let $tweet = $(
      `<article class='tweet'>
         <header>
            <span>
              <div><img src=${tweetObj.user.avatars}>
                <p>${escape(tweetObj.user.name)}</p>
              </div>
            </span>
            <span>
              ${escape(tweetObj.user.handle)}
            </span>
          </header>
          <p id="Content">
            ${escape(tweetObj.content.text)}
          </p>
          <footer>
            <time class="timeago" datetime=${tweetObj.created_at}></time>
            <span>
              <i class="fas fa-flag"></i>
              <i class="fas fa-retweet"></i>
              <i class="fas fa-heart"></i>
            </span>
          </footer>
       </article>`);
    return $tweet;
  }

  // get tweets from server and pass to renderTweets()
  const loadTweets = function() {
    $.ajax("/tweets", { type: "GET", success: function(tweetArray) {
      // let tweets = JSON.parse(tweetArray);
      console.log(tweetArray);
      renderTweets(tweetArray);
      timeago.render(document.querySelectorAll('.timeago'));
    }})

  }
  
  // initial call to load tweets, hide error msg, and focus textarea
  loadTweets();
  $("#error-msg").hide();
  $("#tweet-text").focus();

  // new tweet form
  $("#tweet-form").on("submit", function(event) {
    event.preventDefault();
    const textData = $( this ).serialize();
    let rawText = textData.slice(5);
    console.log(rawText);
    if (rawText === "") {
      $("#error-msg").html("Error: Not enough message");
      $("#error-msg").slideDown("fast");
      return;
    }
    if (rawText.length > 140) {
      $("#error-msg").html("Error: Too much message");
      $("#error-msg").slideDown("fast");
      return;
    }
    $("#error-msg").slideUp("fast");
    $.ajax("/tweets", { type: "POST", data: textData})
      .then(() => {
        loadTweets()
      })
      .then(() => {
        $("#tweet-text").val('');
        $("#tweet-counter").val(140);
      })
  })

  // toggle new tweet form
  $("#doubledown").on("click", function(event) {
    $(".new-tweet").slideToggle("fast");
    $("#tweet-text").focus();
  });

  // if scrolled down far enough, show (back to top) button
  const slideOnScroll = function () {
    console.log(window.scrollY);
    if (window.scrollY > 1000) {
      $("#doubleup").slideDown("fast");
    } else {
      $("#doubleup").slideUp("fast");
    }
  }


  let $window = $(window);

  // function for scroll check
  $window.on('scroll resize', slideOnScroll);
  $window.trigger('scroll');

  // back to top button
  $("#doubleup").on("click", function(event) {
    window.scroll(0, 0);
  });

});
