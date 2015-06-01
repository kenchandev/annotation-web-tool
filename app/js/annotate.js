(function(global, $){
  
  var Annotation = function(){

  }

  function getFullCSSPath(el){
    var names = [];
    while (el.parentNode){
      if (el.id){
        names.unshift('#'+el.id);
        break;
      }else{
        if (el==el.ownerDocument.documentElement) names.unshift(el.tagName);
        else{
          for (var c=1,e=el;e.previousElementSibling;e=e.previousElementSibling,c++);
          names.unshift(el.tagName+":nth-child("+c+")");
        }
        el=el.parentNode;
      }
    }
    return names.join(" > ");
  }

  function highlightText(hexColor, fontStyle) {
    //  Clear the old comment
    $('.materialize-textarea').val("");

    var selection = window.getSelection().getRangeAt(0);
    var selectedText = selection.extractContents();
    var span = document.createElement('span');
    span.style.backgroundColor = hexColor;
    span.className = 'selected-text';

    if(fontStyle !== undefined)
    {
      switch(fontStyle){
        case 'bold':
          span.style.fontWeight = 'bold'; 
          break;
        case 'italic':
          span.style.fontStyle = 'italic';
          break;
        case 'underline':
          span.style.textDecoration = 'underline'; 
          break;
        default:
          break;
      }
    }

    span.appendChild(selectedText);
    selection.insertNode(span);

    console.log(getFullCSSPath(span));

    return {
      text:span.innerText,
      cssPath:getFullCSSPath(span)
    };
  }

  function unhighlightText(){
      $('#text-box').find('.selected-text').contents().unwrap();
  }

  $(".container").on('mouseup', function () {
      var selectedObj = highlightText('#FEC324');
      insertComment(selectedObj);
      $('.comment-area textarea').focus();
  });

  function insertComment(selectedObj){
    console.log(selectedObj);
    if(selectedObj.text)
      commentsRef.push({
        twitterUserID: twitterUserID,
        body: selectedObj.text,
        path: selectedObj.cssPath
      });
  }

  $(".container").on('mousedown', function () {
  
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
  annotationBar.style.boxShadow = "0px 0px 16px rgba(0, 0, 0, 0.6)";

  document.body.appendChild(annotationBar);

  $("<i></i>").addClass('mdi-action-account-box').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-mode-edit').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-insert-comment').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-bold').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-italic').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-color-text').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-clear').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-action-view-headline').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-navigation-arrow-forward').css({'display':'block', 'position':'absolute',  'margin-left': 'auto', 'margin-right': 'auto','left': '0','right': '0', 'bottom':'0'}).appendTo('.annotation');

  $(".mdi-action-account-box, .mdi-editor-mode-edit, .mdi-editor-insert-comment, .mdi-editor-format-bold, .mdi-editor-format-italic, .mdi-editor-format-color-text, .mdi-editor-format-clear, .mdi-action-view-headline, .mdi-navigation-arrow-forward").on('mouseover', function(){
    $(this).css({"color":"#26A69A", "cursor":"pointer"});
  }).on('mouseout', function(){
    $(this).css({"color":"white", "cursor":"none"});
  });

  $('.mdi-editor-format-bold').on('click', function(){
    $('.annotate').css("color", "#26A69A");
    $(this).css("color", "#26A69A");
    // $(document).on('mouseup', function() {
    //   boldText('#FEC324');
    // });

    // $(document).on('mousedown', function() {
    //   unboldText();
    // });
  });

  $('.mdi-editor-format-italic').on('click', function(){
    $('.annotate').css("color", "#26A69A");
    $(this).css("color", "#26A69A");
    // $(document).on('mouseup', function () {
    //   boldText('#FEC324');
    // });

    // $(document).on('mousedown', function() {
    //   unboldText();
    // });
  });

  $('.mdi-editor-format-color-text').on('click', function(){
    $('.annotate').css("color", "#26A69A");
    $(this).css("color", "#26A69A");
    // $(document).on('mouseup', function() {
    //   boldText('#FEC324');
    // });

    // $(document).on('mousedown', function() {
    //   unboldText();
    // });
  });

  var rootRef = new Firebase("https://web-annotation.firebaseio.com/");
  var commentsRef = rootRef.child("comments");
  var twitterUserID = "Anonymous";

  $('.mdi-action-account-box').on('click', function(){
      
    rootRef.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        twitterUserID = authData.uid.split(':')[1];
      }
      //  remember: sessionOnly
      //  This is an optional third parameter. Session expires upon browser exiting.
    });
  });


  var commentArea = document.createElement("div");

  commentArea.className = "comment-area";
  
  commentArea.style.background = "#252525";
  commentArea.style.width = "15%";
  commentArea.style.height = "20%";
  //  This style is necessary for animating out.
  commentArea.style.padding = "0px 10px";
  commentArea.style.display = "none";
  commentArea.style.top = "0%";
  commentArea.style.bottom = "80%";
  commentArea.style.position = "fixed";
  commentArea.style.textAlign = "center";
  commentArea.style.right = "0px";
  commentArea.style.overflow = "scroll";
  commentArea.style.color = "white";
  commentArea.style.fontSize = "8px";
  commentArea.style.boxShadow = "0px 0px 16px rgba(0, 0, 0, 0.6)";

  document.body.appendChild(commentArea);

  $("<div></div>").addClass('input-field').appendTo('.comment-area');
  $("<textarea></textarea>").addClass('materialize-textarea').attr('id', 'textarea1').appendTo('.input-field');
  $("<label></label>").attr('for', 'textarea1').text('Comment').appendTo('.input-field');

  var commentList = document.createElement("div");

  commentList.className = "comment-list";
  
  commentList.style.background = "#252525";
  commentList.style.width = "15%";
  commentList.style.height = "20%";
  //  This style is necessary for animating out.
  commentList.style.display = "none";
  commentList.style.top = "80%";
  commentList.style.bottom = "0%";
  commentList.style.position = "fixed";
  commentList.style.textAlign = "center";
  commentList.style.right = "0px";
  commentList.style.overflow = "scroll";
  commentList.style.color = "white";
  commentList.style.fontSize = "8px";
  commentList.style.boxShadow = "0px 0px 16px rgba(0, 0, 0, 0.6)";

  document.body.appendChild(commentList);
  
  function iconOn(selector){
    selector.off("mouseout");
    selector.css("color", "#26A69A");
  }

  function iconOff(selector){
    selector.on("mouseout", function(){
      $(this).css("color", "white");
    });
    selector.css("color", "white");
  }

  //  For adding comments...

  $(".mdi-editor-insert-comment").one("click", handler_comment_one);

  function handler_comment_one(){
    iconOn($(this));
    toggleCommentFunction();
    $(this).one("click", handler_comment_two);
  }

  function handler_comment_two(){
    iconOff($(this));
    toggleCommentFunction();
    $(this).one("click", handler_comment_one);
  }

  function toggleCommentFunction(){
    $(".comment-area").toggle(function(){
        $(".comment-area").animate({ "right": "-15%" }, "fast" );
      },
        function(){
      $( ".comment-area" ).animate({ "right": "0%" }, "fast" );

        });
  }

  //  For listing comments...

  $(".mdi-action-view-headline").one("click", handler_list_one);

  function handler_list_one(){
    iconOn($(this));
    toggleListFunction();
    $(this).one("click", handler_list_two);
  }

  function handler_list_two(){
    iconOff($(this));
    toggleListFunction();
    $(this).one("click", handler_list_one);
  }

  function toggleListFunction(){
    $(".comment-list").toggle(function(){
        $(".comment-list").animate({ "right": "-15%" }, "fast" );
      },
        function(){
      $( ".comment-list" ).animate({ "right": "0%" }, "fast" );

        });
  }

  /******/
  //  For bolding text...
  /******/

  $(".mdi-editor-format-bold").one("click", handler_bold_one);

  function handler_bold_one(){
    iconOn($(this));

    $('.container').off('mouseup');
    $(".container").on('mouseup', function () {
      console.log("Inside");
      var selectedObj = highlightText('#FEC324', 'bold');
      insertComment(selectedObj);
      $('.comment-area textarea').focus();
    });

    $('.container').off('mousedown');
    $(".container").on('mousedown', function () {
      unhighlightText();
      //  Time to set focus to the comment box...
    });

    $(this).one("click", handler_bold_two);
  }

  function handler_bold_two(){
    iconOff($(this));

    


    $(".container").on('mouseup', function () {
      var selectedObj = highlightText('#FEC324');
      insertComment(selectedObj);
      $('.comment-area textarea').focus();
    });

  $(".container").on('mousedown', function () {
  
      unhighlightText();
  });

    $(this).one("click", handler_bold_one);
  }

  /******/
  //  For underlining text...
  /******/

  $(".mdi-editor-format-color-text").one("click", handler_underline_one);

  function handler_underline_one(){
    iconOn($(this));
    $(".container").off('mouseup');
    $(".container").on('mouseup', function () {
      console.log("Inside");
      var selectedObj = highlightText('#FEC324', 'underline');
      insertComment(selectedObj);
      $('.comment-area textarea').focus();
    });

    $(".container").off('mousedown');
    $(".container").on('mousedown', function () {
      unhighlightText();
    });

    $(this).one("click", handler_underline_two);
  }

  function handler_underline_two(){
    iconOff($(this));

    $(".container").on('mouseup', function () {
      var selectedObj = highlightText('#FEC324');
      insertComment(selectedObj);
      $('.comment-area textarea').focus();
    });

    $(".container").on('mousedown', function () {
        unhighlightText();
    });

    $(this).one("click", handler_underline_one);
  }

  /******/
  //  For italicizing text...
  /******/

  $(".mdi-editor-format-italic").one("click", handler_italicize_one);

  function handler_italicize_one(){
    iconOn($(this));

    $(".container").off('mouseup');
    $(".container").on('mouseup', function () {
      console.log("Inside");
      var selectedObj = highlightText('#FEC324', 'italic');
      insertComment(selectedObj);
      $('.comment-area textarea').focus();
    });

    $(".container").off('mousedown');
    $(".container").on('mousedown', function () {
      unhighlightText();
    });

    $(this).one("click", handler_italicize_two);
  }

  function handler_italicize_two(){
    iconOff($(this));

  
    $(".container").on('mouseup', function () {
      var selectedObj = highlightText('#FEC324');
      insertComment(selectedObj);
      $('.comment-area textarea').focus();
    });

  $(".container").on('mousedown', function () {
  
      unhighlightText();
  });

    $(this).one("click", handler_italicize_one);
  }

  //  For each CSS selector for an HTML item, store into Firebase...

  //  Let's render the last ten elements


}(window, jQuery));