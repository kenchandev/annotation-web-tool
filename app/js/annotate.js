(function(global, $){
  
  var Annotation = function(){

  }

  function highlightText(hexColor) {
    var selection = window.getSelection().getRangeAt(0);
    var selectedText = selection.extractContents();
    var span = document.createElement('span');
    span.style.backgroundColor = hexColor;
    span.className = 'selected-text';
    span.appendChild(selectedText);
    selection.insertNode(span);
  }

  function unhighlightText(){
      $('#text-box').find('.selected-text').contents().unwrap();;
  }

  $(document).on('mouseup', function () {
      highlightText('#FEC324');
  });

  $(document).on('mousedown', function () {
  
      unhighlightText();
  });

  $('.selected-text').on('click', function(){
    console.log($(this));
  });

  //  Create the annotation bar... Might reserve this for comments.

  var annotationBar = document.createElement("div");

  annotationBar.className = "annotation"
  annotationBar.style.width = "5%";
  annotationBar.style.height = "50%";
  annotationBar.style.background = "#252525";
  annotationBar.style.color = "white";
  annotationBar.style.top = "25%";
  annotationBar.style.bottom = "25%";
  annotationBar.style.position = "fixed";
  annotationBar.style.textAlign = "center";
  annotationBar.style.right = "0px";
  annotationBar.style.fontSize = "1.6em";

  document.body.appendChild(annotationBar);

  $("<i></i>").addClass('mdi-notification-adb').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-mode-edit').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-insert-comment').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-bold').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-italic').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-color-text').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-clear').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-navigation-arrow-forward').css('display', 'block').appendTo('.annotation');

  $(".mdi-notification-adb, .mdi-editor-mode-edit, .mdi-editor-insert-comment, .mdi-editor-format-bold, .mdi-editor-format-italic, .mdi-editor-format-color-text, .mdi-editor-format-clear, .mdi-navigation-arrow-forward").on('mouseover', function(){
    $(this).css({"color":"#0F97F9", "cursor":"pointer"});
  }).on('mouseout', function(){
    $(this).css({"color":"white", "cursor":"none"});
  });

  $('.mdi-editor-format-bold').on('click', function(){
    $('.annotate').css("color", "#0F97F9");
    $(this).css("color", "#0F97F9");
    $(document).on('mouseup', function() {
      boldText('#FEC324');
    });

    $(document).on('mousedown', function() {
      unboldText();
    });
  });

  $('.mdi-editor-format-italic').on('click', function(){
    $('.annotate').css("color", "#0F97F9");
    $(this).css("color", "#0F97F9");
    $(document).on('mouseup', function () {
      boldText('#FEC324');
    });

    $(document).on('mousedown', function() {
      unboldText();
    });
  });

  $('.mdi-editor-format-color-text').on('click', function(){
    $('.annotate').css("color", "#0F97F9");
    $(this).css("color", "#0F97F9");
    $(document).on('mouseup', function() {
      boldText('#FEC324');
    });

    $(document).on('mousedown', function() {
      unboldText();
    });
  });

  var ref = new Firebase("https://web-annotation.firebaseio.com/");

  $('.mdi-notification-adb').on('click', function(){
      
    ref.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
      //  remember: sessionOnly
      //  This is an optional third parameter. Session expires upon browser exiting.
    });
  });

  //  For each CSS selector for an HTML item, store into Firebase...



  // $('.mdi-navigation-arrow-drop-down').toggle(function(){
  //   $('.annotation').animate({
  //     bottom: '-=120'
  //   }, 1000);
  // },function() {
  //   $('.annotation').animate({
  //     bottom: '+=0'
  //   }, 1000);
  // });

// mdi-action-label
// mdi-content-create
// mdi-content-flag

// mdi-editor-format-bold
// mdi-editor-format-italic
// mdi-editor-format-color-text
// mdi-editor-format-clear

// mdi-editor-insert-comment
// mdi-editor-mode-edit

}(window, jQuery));