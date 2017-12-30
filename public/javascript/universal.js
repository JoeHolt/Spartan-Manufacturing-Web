$.get("navigation.html", function(data) {
  $("#nav-placeholder").replaceWith(data);
})
$(document).ready(function() {
    var isshow = localStorage.getItem('isshow');
    if (isshow== null || isshow == 0) {
        localStorage.setItem('isshow', 1);
        // Show popup here
        alert("Welcome to the Spartan Manufacturing Hub!\nPlease report any issues you have to me (Joe Holt), thank you!");
    }
});
