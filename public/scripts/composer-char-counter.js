$( document ).ready(function() {
  const textareaElement = document.getElementById("tweet-text");
  textareaElement.addEventListener("input", function() {
    let counter = 140 - $(this).val().length;
    if (counter < 0) {
      $("#tweet-counter").css("color", "red");
    }
    if (counter >= 0) {
      $("#tweet-counter").css("color", "black");
    }
    $("#tweet-counter").text(counter);
  });
});