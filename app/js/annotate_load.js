//  This script loads external resources (scripts, stylesheets, etc.).
//  This may appear silly, but its purpose is for optimization purposes.
//  This article is an excellent reference for explaining this: 
//  http://www.html5rocks.com/en/tutorials/speed/script-loading/
//  Courtesy of Arnaud Sahuguet!

//  Dynamically load the scripts by appending them to the head tag in the html document.
function scriptInjection(src) {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src = src;
  s.async = false;
  document.head.appendChild(s);
  console.log(src + " loaded...")
}

//  Dynamically load the css stylesheets by appending them to the head tag in the html document.
function cssInjection(href) {
  var s = document.createElement("link");
  s.type = "text/css";
  s.rel = "stylesheet";
  s.href = href;
  document.head.appendChild(s);
  console.log(href + " loaded...");
}

[
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.96.1/css/materialize.min.css"
].forEach(cssInjection);

[
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js",
  "https://cdn.firebase.com/js/client/2.2.6/firebase.js",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.96.1/js/materialize.min.js",
  "js/annotate.min.js"
].forEach(scriptInjection);
