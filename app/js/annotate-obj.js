(function(global, $){

  function getFullCSSPath(el){
    var names = [];
    while (el.parentNode){
      console.log(el.parentNode);
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
      console.log("-------fdja;dfshfdas;jlhfdalkdfa");
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
        case 'cross':
          span.style.textDecoration = 'line-through'; 
          break;
        default:
          break;
      }
    }
    else
    {
      console.log("Normal!!!");
      span.style.fontWeight = 'normal';
      span.style.fontStyle = 'normal';
      span.style.textDecoration = 'none';
    }

    console.log(span.style);

    span.appendChild(selectedText);
    selection.insertNode(span);

    console.log();

    return {
      text:span.innerText,
      parentCSSPath:getFullCSSPath(span.parentNode),
      currentCSSPath:getFullCSSPath(span)
    };
  }

  function unhighlightText(){
    console.log($('#text-box').find('.selected-text'));
      $('#text-box').find('.selected-text').contents().unwrap();
  }

  $(".container").on('mouseup', function () {
      var selectedObj = highlightText('#FEC324');
      var currentRef = insertComment(selectedObj);
      if($('.comment-area').css('right') === "-15%" || $('.comment-area').css('right') === "0%")
      {
        $(".comment-area").css("display","block").animate({"right": "0%" }, "fast" );
      }

      if($('.comment-list').css('right') === "-15%" || $('.comment-list').css('right') === "0%")
      {
        $(".comment-list").css("display","block").animate({"right": "0%" }, "fast" );
      }

      $('.comment-area textarea').focus();
      $('.comment-area textarea').change(function() {
          currentRef.update({
            comment: $('.comment-area textarea').val()
          });
          //  Need to reflect this change in real-time
      });

  });

  function insertComment(selectedObj){
    console.log(selectedObj);
    if(selectedObj.text)
      //  Returns a reference to the object inserted thus far.
      return commentsRef.push({
        twitterUserID: twitterUserID,
        twitterName: twitterName,
        twitterHandle: twitterHandle,
        highlighted_text: selectedObj.text,
        comment: "",
        path: selectedObj.currentCSSPath,
        parentPath: selectedObj.parentCSSPath
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
  $("<i></i>").addClass('mdi-file-cloud-download').css({'display':'block', 'position':'absolute',  'margin-left': 'auto', 'margin-right': 'auto','left': '0','right': '0', 'bottom':'0'}).appendTo('.annotation');

  $(".mdi-action-account-box, .mdi-editor-mode-edit, .mdi-editor-insert-comment, .mdi-editor-format-bold, .mdi-editor-format-italic, .mdi-editor-format-color-text, .mdi-editor-format-clear, .mdi-action-view-headline, .mdi-file-cloud-download").on('mouseover', function(){
    $(this).css({"color":"#26A69A", "cursor":"pointer"});
  }).on('mouseout', function(){
    $(this).css({"color":"white", "cursor":"none"});
  });

  $('.mdi-editor-format-bold').on('click', function(){
    $('.annotate').css("color", "#26A69A");
    $(this).css("color", "#26A69A");

  });

  $('.mdi-editor-format-italic').on('click', function(){
    $('.annotate').css("color", "#26A69A");
    $(this).css("color", "#26A69A");

  });

  $('.mdi-editor-format-color-text').on('click', function(){
    $('.annotate').css("color", "#26A69A");
    $(this).css("color", "#26A69A");

  });

  var rootRef = new Firebase("https://web-annotation.firebaseio.com/");
  var commentsRef = rootRef.child("comments");
  var twitterUserID = "404";
  var twitterName = "Anonymous"
  var twitterHandle = "@Anonymous";

  var internalCommentsDict = {};

  // var last10Comments = commentsRef.limit(10);

  commentsRef.on('child_added', function(snapshot){
    var item = snapshot.val();

    var newDiv = $("<div/>").addClass("comment").attr("id",snapshot.name()).appendTo("#comments");

    console.log(item);
    $('.comment-list .collection').append(
      '<a href="#!" class="collection-item" style="line-height:0.5rem;" id="'+ snapshot.name().substring(1) +'">' + 
        "<strong>" + item.twitterName + "</strong>" + ": " + "<br/>" + "<em style='color: #252525;'>Highlighted Text</em>" + ": " + "<br/>" + "<span class='highlighted-text'>" + item.highlighted_text + "</span>" + "<br/>" + "<em style='color: #252525;''>Comment</em>" + ": " + "<br/>" + "<span class='comment-text'>" + item.comment + "</span>" + 
      '</li>'
      );
  });

  commentsRef.on('child_changed', function(snapshot){
    console.log(snapshot.val());
    $("#" + snapshot.name().substring(1) + " span.comment-text").text(snapshot.val().comment)
  });

  commentsRef.on("child_removed", function(snapshot) {
    $("#" + snapshot.name().substring(1)).remove();
  });

  $('.mdi-action-account-box').on('click', function(){
      
    rootRef.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        console.log(authData);
        twitterUserID = authData.uid.split(':')[1];
        twitterName = authData.twitter.displayName;
        twitterHandle = authData.twitter.username;
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
  commentArea.style.right = "0%";
  commentArea.style.overflow = "scroll";
  commentArea.style.color = "white";
  commentArea.style.fontSize = "8px";
  commentArea.style.boxShadow = "0px 0px 16px rgba(0, 0, 0, 0.6)";

  document.body.appendChild(commentArea);

  $("<div></div>").addClass('input-field').appendTo('.comment-area');
  $("<textarea></textarea>").addClass('materialize-textarea').attr('id', 'textarea1').appendTo('.input-field');
  $("<label></label>").attr('for', 'textarea1').text('Comment').appendTo('.input-field');

  var commentList = document.createElement("div");

  commentList.className = "comment-list container";
  
  commentList.style.background = "#252525";
  commentList.style.width = "15%";
  commentList.style.height = "20%";
  //  This style is necessary for animating out.
  commentList.style.display = "none";
  commentList.style.top = "80%";
  commentList.style.bottom = "0%";
  commentList.style.position = "fixed";
  commentList.style.textAlign = "center";
  commentList.style.right = "0%";
  commentList.style.overflow = "scroll";
  commentList.style.color = "white";
  commentList.style.fontSize = "8px";
  commentList.style.boxShadow = "0px 0px 16px rgba(0, 0, 0, 0.6)";

  document.body.appendChild(commentList);

  $("<ul></ul>").addClass('collection').css('border', 'none').appendTo('.comment-list');
  
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
    //  Must turn off italicizing, underlining and crossing.
    handler_underline_two();
    handler_italicize_two();
    handler_crossing_two();

    iconOn($(this));

    $('.container').off('mouseup');
    $('.container').off('mousedown');

    $(".container").on('mouseup', function () {
      console.log("Inside");
      var selectedObj = highlightText('#FFFFFF', 'bold');
      var currentRef = insertComment(selectedObj);
      if($('.comment-area').css('right') === "-15%" || $('.comment-area').css('right') === "0%")
      {
        $(".comment-area").css("display","block").animate({"right": "0%" }, "fast" );
      }
      if($('.comment-list').css('right') === "-15%" || $('.comment-list').css('right') === "0%")
      {
        $(".comment-list").css("display","block").animate({"right": "0%" }, "fast" );
      }

      $('.comment-area textarea').focus();
      $('.comment-area textarea').change(function() {
          currentRef.update({
            comment: $('.comment-area textarea').val()
          });
          //  Need to reflect this change in real-time
      });
    });

    $(".container").on('mousedown', function () {
      unhighlightText();
      //  Time to set focus to the comment box...
    });

    

    $(this).one("click", handler_bold_two);
  }

  function handler_bold_two(){
    iconOff($('.mdi-editor-format-bold'));

    $('.container').off('mouseup');
    $('.container').off('mousedown');

    $(".container").on('mouseup', function () {
      var selectedObj = highlightText('#FEC324');
      var currentRef = insertComment(selectedObj);
      if($('.comment-area').css('right') === "-15%" || $('.comment-area').css('right') === "0%")
      {
        $(".comment-area").css("display","block").animate({"right": "0%" }, "fast" );
      }
      if($('.comment-list').css('right') === "-15%" || $('.comment-list').css('right') === "0%")
      {
        $(".comment-list").css("display","block").animate({"right": "0%" }, "fast" );
      }

      $('.comment-area textarea').focus();
      $('.comment-area textarea').change(function() {
          currentRef.update({
            comment: $('.comment-area textarea').val()
          });
          //  Need to reflect this change in real-time
      });
    });

  $(".container").on('mousedown', function () {
  
      unhighlightText();
  });

  

    $('.mdi-editor-format-bold').one("click", handler_bold_one);
  }

  /******/
  //  For underlining text...
  /******/

  $(".mdi-editor-format-color-text").one("click", handler_underline_one);

  function handler_underline_one(){
    //  Must turn off italicizing, bolding and crossing.
    handler_bold_two();
    handler_italicize_two();
    handler_crossing_two();

    iconOn($(this));

    $(".container").off('mouseup');
    $(".container").off('mousedown');

    $(".container").on('mouseup', function () {
      console.log("Inside");
      var selectedObj = highlightText('#FFFFFF', 'underline');
      var currentRef = insertComment(selectedObj);
      if($('.comment-area').css('right') === "-15%" || $('.comment-area').css('right') === "0%")
      {
        $(".comment-area").css("display","block").animate({"right": "0%" }, "fast" );
      }
      if($('.comment-list').css('right') === "-15%" || $('.comment-list').css('right') === "0%")
      {
        $(".comment-list").css("display","block").animate({"right": "0%" }, "fast" );
      }

      $('.comment-area textarea').focus();
      $('.comment-area textarea').change(function() {
          currentRef.update({
            comment: $('.comment-area textarea').val()
          });
          //  Need to reflect this change in real-time
      });
    });

    
    $(".container").on('mousedown', function () {
      unhighlightText();
    });

    

    $(this).one("click", handler_underline_two);
  }

  function handler_underline_two(){
    iconOff($('.mdi-editor-format-color-text'));

        $('.container').off('mouseup');
    $('.container').off('mousedown');

    $(".container").on('mouseup', function () {
      var selectedObj = highlightText('#FEC324');
      var currentRef = insertComment(selectedObj);
      if($('.comment-area').css('right') === "-15%" || $('.comment-area').css('right') === "0%")
      {
        $(".comment-area").css("display","block").animate({"right": "0%" }, "fast" );
      }
      if($('.comment-list').css('right') === "-15%" || $('.comment-list').css('right') === "0%")
      {
        $(".comment-list").css("display","block").animate({"right": "0%" }, "fast" );
      }

      $('.comment-area textarea').focus();
      $('.comment-area textarea').change(function() {
          currentRef.update({
            comment: $('.comment-area textarea').val()
          });
          //  Need to reflect this change in real-time
      });
    });

    $(".container").on('mousedown', function () {
        unhighlightText();
    });

    

    $('.mdi-editor-format-color-text').one("click", handler_underline_one);
  }

  /******/
  //  For italicizing text...
  /******/

  $(".mdi-editor-format-italic").one("click", handler_italicize_one);

  function handler_italicize_one(){
    //  Must turn off underlining, bolding and crossing.
    handler_bold_two();
    handler_underline_two();
    handler_crossing_two();

    iconOn($(this));

        $('.container').off('mouseup');
    $('.container').off('mousedown');

    $(".container").on('mouseup', function () {
      console.log("Inside");
      var selectedObj = highlightText('#FFFFFF', 'italic');
      var currentRef = insertComment(selectedObj);
      if($('.comment-area').css('right') === "-15%" || $('.comment-area').css('right') === "0%")
      {
        $(".comment-area").css("display","block").animate({"right": "0%" }, "fast" );
      }
      if($('.comment-list').css('right') === "-15%" || $('.comment-list').css('right') === "0%")
      {
        $(".comment-list").css("display","block").animate({"right": "0%" }, "fast" );
      }

      $('.comment-area textarea').focus();
      $('.comment-area textarea').change(function() {
          currentRef.update({
            comment: $('.comment-area textarea').val()
          });
          //  Need to reflect this change in real-time
      });
    });

    $(".container").on('mousedown', function () {
      unhighlightText();
    });

    

    $(this).one("click", handler_italicize_two);
  }

  function handler_italicize_two(){
    iconOff($('.mdi-editor-format-italic'));

        $('.container').off('mouseup');
    $('.container').off('mousedown');

    $(".container").on('mouseup', function () {
      var selectedObj = highlightText('#FEC324');
      var currentRef = insertComment(selectedObj);
      if($('.comment-area').css('right') === "-15%" || $('.comment-area').css('right') === "0%")
      {
        $(".comment-area").css("display","block").animate({"right": "0%" }, "fast" );
      }
      if($('.comment-list').css('right') === "-15%" || $('.comment-list').css('right') === "0%")
      {
        $(".comment-list").css("display","block").animate({"right": "0%" }, "fast" );
      }

      $('.comment-area textarea').focus();
      $('.comment-area textarea').change(function() {
          currentRef.update({
            comment: $('.comment-area textarea').val()
          });
          //  Need to reflect this change in real-time
      });
    });

  $(".container").on('mousedown', function () {
  
      unhighlightText();
  });

    $('.mdi-editor-format-italic').one("click", handler_italicize_one);
  }

  /******/
  //  For crossing text...
  /******/

  $(".mdi-editor-format-clear").one("click", handler_crossing_one);

  function handler_crossing_one(){
    //  Must turn off italicizing, bolding and crossing.
    handler_bold_two();
    handler_italicize_two();
    handler_underline_two();

    iconOn($(this));

        $('.container').off('mouseup');
    $('.container').off('mousedown');

    $(".container").on('mouseup', function () {
      console.log("Inside");
      var selectedObj = highlightText('#FFFFFF', 'cross');
      var currentRef = insertComment(selectedObj);
      if($('.comment-area').css('right') === "-15%" || $('.comment-area').css('right') === "0%")
      {
        $(".comment-area").css("display","block").animate({"right": "0%" }, "fast" );
      }
      if($('.comment-list').css('right') === "-15%" || $('.comment-list').css('right') === "0%")
      {
        $(".comment-list").css("display","block").animate({"right": "0%" }, "fast" );
      }

      $('.comment-area textarea').focus();
      $('.comment-area textarea').change(function() {
          currentRef.update({
            comment: $('.comment-area textarea').val()
          });
          //  Need to reflect this change in real-time
      });
    });

    $(".container").on('mousedown', function () {
      unhighlightText();
    });

    

    $(this).one("click", handler_crossing_two);
  }

  function handler_crossing_two(){
    iconOff($('.mdi-editor-format-clear'));

        $('.container').off('mouseup');
    $('.container').off('mousedown');
  
    $(".container").on('mouseup', function () {
      var selectedObj = highlightText('#FEC324');
      var currentRef = insertComment(selectedObj);
      if($('.comment-area').css('right') === "-15%" || $('.comment-area').css('right') === "0%")
      {
        $(".comment-area").css("display","block").animate({"right": "0%" }, "fast" );
      }
      if($('.comment-list').css('right') === "-15%" || $('.comment-list').css('right') === "0%")
      {
        $(".comment-list").css("display","block").animate({"right": "0%" }, "fast" );
      }

      $('.comment-area textarea').focus();
       $('.comment-area textarea').change(function() {
          currentRef.update({
            comment: $('.comment-area textarea').val()
          });
          //  Need to reflect this change in real-time
      });
    });

  $(".container").on('mousedown', function () {
      unhighlightText();
  });

 

    $('.mdi-editor-format-clear').one("click", handler_crossing_one);
  }




  //  For each CSS selector for an HTML item, store into Firebase...

  //  Let's render the last ten elements
}(window, jQuery));