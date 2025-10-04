document.addEventListener("DOMContentLoaded", function() {
  const redirect = document.getElementById("redirect");
  if (redirect) {
    window.location.href = redirect.dataset.to;
  }
});