$.get("navigation.html", function(data) {
  $("#nav-placeholder").replaceWith(data);
})
$('.selectpicker').selectpicker({
  style: 'btn-info',
  size: 2
});
