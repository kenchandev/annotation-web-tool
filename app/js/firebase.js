var rootRef = new Firebase("https://web-annotation.firebaseio.com/")

rootRef.set({});

rootRef.on("value", function(data){
  var name = data.val() ? data.val().name : "";
  console.log("Testing");
});