//  Comments can be edited in Firebase, but not on the front-end due to integrity issues.
(function(global, $) {

  //  Grab the parameters!
  var container = $("script#annotate").attr("container");
  var elements = $("script#annotate").attr("elements");
  //  Additional styles for "on" and "off" annotations and speech bubbles for listing comments.
  $("<style type='text/css'> .on-annotation{ color:#26A69A; } .off-annotation{ color:#FFFFFF;} .bubble{ position: relative; width: 250px; height: 350px; padding: 0px; background: #26A69A; -webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; } .bubble:after { content: ''; position: absolute; border-style: solid; border-width: 0px 20px 15px; border-color: #26A69A transparent; display: block; width: 0; z-index: 1; top: -14px; left: 105px; } </style>").appendTo("head");

  //  Create the annotation bar with icons...
  var annotationBar = document.createElement("div");

  annotationBar.className = "annotation"
  annotationBar.style.width = "5%";
  annotationBar.style.height = "14.4em"; //  9 icons, 1.6em each.
  annotationBar.style.background = "#252525";
  annotationBar.style.color = "white";
  annotationBar.style.top = "25%";
  annotationBar.style.bottom = "25%";
  annotationBar.style.position = "fixed";
  annotationBar.style.textAlign = "center";
  annotationBar.style.right = "0px";
  annotationBar.style.fontSize = "1.6em";
  annotationBar.style.lineHeight = "1.6em";
  annotationBar.style.boxShadow = "0px 0px 16px rgba(0, 0, 0, 0.6)";

  document.body.appendChild(annotationBar);

  $("<i></i>").addClass('mdi-action-account-box').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-insert-comment off-annotation').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-mode-edit on-annotation').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-bold off-annotation').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-italic off-annotation').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-color-text off-annotation').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-editor-format-clear off-annotation').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-action-view-headline off-annotation').css('display', 'block').appendTo('.annotation');
  $("<i></i>").addClass('mdi-content-archive off-annotation').css({
    'display': 'block'
  }).appendTo('.annotation');

  var rootRef = new Firebase($("script#annotate").attr("firebase"));
  //  URL's seem quite unique, but Firebase does not support properties with punctuation marks.
  var urlRef = rootRef.child(window.location.href.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
  var commentsRef = urlRef.child("comments");
  var twitterUserID = "404";
  var twitterName = "Anonymous";
  var twitterHandle = "@Anonymous";
  var currentRef;
  var parentCSSRefPath = null;
  var printAllFlag = true;

  var commentsExistDict = {};
  var internalCommentsDict = {};

  // var last10Comments = commentsRef.limit(10);

  var commentArea = document.createElement("div");

  commentArea.className = "comment-area";
  commentArea.style.background = "#252525";
  commentArea.style.width = "15%";
  commentArea.style.height = "20%";
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
  var bubbleContainer = $("<div></div>").addClass('bubble-items').appendTo(container);

  //  Append comment icons to the end of each paragraph/header tag
  var iconsDivs = $("<i></i>").addClass("mdi-notification-sms-failed").css({'cursor': 'pointer', 'font-size': '15px'}).appendTo(elements);
  //  Need this to color for exstence of comments in a section...
  $('.mdi-notification-sms-failed').each(function(i) {
    commentsExistDict[getFullCSSPath($(this)[0].parentNode)] = $(this);
    $('<div></div>').addClass('bubble').css('display', 'none').appendTo(bubbleContainer);
  });

  //  Set the action listener for the button
  $('.mdi-notification-sms-failed').on("click", function() {
    var index = $(".mdi-notification-sms-failed").index(this);
    var position = $(this).position();
    var width = $(this).width(); //  Take into account additional padding/margins
    console.log(index);
    $('.bubble-items .bubble:nth-of-type(' + (index + 1) + ')').css({
      position: "absolute",
      top: (position.top + 30) + "px",
      left: (position.left - Math.floor(250 / 2) + 7) + "px"  //  Half of the width of the comment box...
    }).toggle();
  });

  /******

    Time to work on the functions.

  ******/

  function getFullCSSPath(el) {
    var names = [];
    while (el.parentNode) {
      if (el.id) {
        names.unshift('#' + el.id);
        break;
      } else {
        if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
        else {
          for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
          names.unshift(el.tagName + ":nth-child(" + c + ")");
        }
        el = el.parentNode;
      }
    }
    return names.join(" > ");
  }

  function highlightText(hexColor, fontStyle) {
    //  Clear the old comment
    $('.materialize-textarea').val("");
    var selection = window.getSelection().getRangeAt(0);

    var selectedText = selection.extractContents();
    var spanStyles = {
      backgroundColor: hexColor,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none'
    };
    var span = document.createElement('span');
    span.style.backgroundColor = hexColor;
    span.className = 'selected-text';

    if (typeof(fontStyle) !== 'undefined') {
      switch (fontStyle) {
        case 'bold':
          span.style.fontWeight = spanStyles.fontWeight = 'bold';
          break;
        case 'italic':
          span.style.fontStyle = spanStyles.fontStyle = 'italic';
          break;
        case 'underline':
          span.style.textDecoration = spanStyles.textDecoration = 'underline';
          break;
        case 'cross':
          span.style.textDecoration = spanStyles.textDecoration = 'line-through';
          break;
        default:
          break;
      }
    } else {
      span.style.fontWeight = 'normal';
      span.style.fontStyle = 'normal';
      span.style.textDecoration = 'none';
    }

    span.appendChild(selectedText);
    selection.insertNode(span);

    return {
      spanStyles: spanStyles,
      selectionObject: selection,
      text: span.innerText,
      parentCSSPath: getFullCSSPath(span.parentNode),
      currentCSSPath: getFullCSSPath(span)
    };
  }

  function unhighlightText() {
    $('#text-box').find('.selected-text').contents().unwrap();
  }

  $(container).on('mouseup', function() {
    mouseupAction(1, '#FEC324');
  });

  var onComplete = function(error) {
    if (error) {
      console.log('Synchronization failed!');
    } else {
      console.log('Synchronization succeeded!');
    }
  };

  function insertComment(selectedObj) {
    if (selectedObj.text) {
      //  Returns a reference to the object inserted thus far.
      return commentsRef.push({
        spanStyles: selectedObj.spanStyles,
        selectionObject: selectedObj.selectionObject,
        twitterUserID: twitterUserID,
        twitterName: twitterName,
        twitterHandle: twitterHandle,
        highlighted_text: selectedObj.text,
        comment: "",
        path: selectedObj.currentCSSPath,
        parentPath: selectedObj.parentCSSPath
      });
    }
  }

  $(container).on('mousedown', function() {
    unhighlightText();
  });

  function hoverActions() {
    var listOfElements = ".off-annotation, .mdi-action-account-box";
    var excludedElements = ".on-annotation";

    $(listOfElements).not(excludedElements).off('mouseover');
    $(listOfElements).not(excludedElements).off('mouseout');

    $(listOfElements).not(excludedElements).on('mouseover', function() {
      $(this).css({
        "color": "#26A69A",
        "cursor": "pointer"
      });
    }).on('mouseout', function() {
      $(this).css({
        "color": "white",
        "cursor": "none"
      });
    });
  }

  hoverActions();

  $('.mdi-editor-format-bold').on('click', function() {
    $('.annotate').css("color", "#26A69A");
    $(this).css("color", "#26A69A");
  });

  $('.mdi-editor-format-italic').on('click', function() {
    $('.annotate').css("color", "#26A69A");
    $(this).css("color", "#26A69A");
  });

  $('.mdi-editor-format-color-text').on('click', function() {
    $('.annotate').css("color", "#26A69A");
    $(this).css("color", "#26A69A");
  });

  commentsRef.on('child_added', function(snapshot) {
    var item = snapshot.val();
    var name = snapshot.name().substring(1);

    internalCommentsDict[name] = item;

    if (item.parentPath === parentCSSRefPath || printAllFlag === true)
      $('.comment-list .collection').append(
        '<a href="#!" class="collection-item" style="line-height:0.5rem;" id="' + name + '">' +
        "<strong>" + item.twitterName + "</strong>" + ": " + "<br/>" + "<em style='color: #252525;'>Highlighted Text</em>" + ": " + "<br/>" + "<span class='highlighted-text'>" + item.highlighted_text + "</span>" + "<br/>" + "<em style='color: #252525;''>Comment</em>" + ": " + "<br/>" + "<span class='comment-text'>" + item.comment + "</span>" +
        '</li>'
      );
    if (item.parentPath in commentsExistDict)
      $('.mdi-notification-sms-failed').filter(function(i) {
        console.log("Yay!");
        return $(this).is(commentsExistDict[item.parentPath]);
      }).css('color', '#26A69A');
  });

  commentsRef.on('child_changed', function(snapshot) {
    var comment = snapshot.val().comment;
    var name = snapshot.name().substring(1);
    $("#" + name + " span.comment-text").text(comment);
    internalCommentsDict[name].comment = comment;
  });

  commentsRef.on("child_removed", function(snapshot) {
    var name = snapshot.name().substring(1);
    $("#" + name).remove();
    delete internalCommentsDict[name];
  });

  $('.mdi-action-account-box').on('click', function() {

    rootRef.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        twitterUserID = authData.uid.split(':')[1];
        twitterName = authData.twitter.displayName;
        twitterHandle = authData.twitter.username;
      }
      //  remember: sessionOnly
      //  This is an optional third parameter. Session expires upon browser exiting.
    });
  });

  //  For adding comments...

  $(".mdi-editor-insert-comment").one("click", handler_comment_one);

  function handler_comment_one() {
    ($(this).hasClass('off-annotation')) ? iconOn($(this)): iconOff($(this));
    toggleCommentFunction();
    $(this).one("click", handler_comment_two);
  }

  function handler_comment_two() {
    ($(this).hasClass('off-annotation')) ? iconOn($(this)): iconOff($(this));
    toggleCommentFunction();
    $(this).one("click", handler_comment_one);
  }

  function toggleCommentFunction() {
    $(".comment-area").toggle(function() {
        $(".comment-area").animate({
          "right": "-15%"
        }, "fast");
      },
      function() {
        $(".comment-area").animate({
          "right": "0%"
        }, "fast");

      });
  }

  //  For listing comments...

  $(".mdi-action-view-headline").one("click", handler_list_one);

  function handler_list_one() {
    iconOn($(this));
    toggleListFunction();
    $(this).one("click", handler_list_two);
  }

  function handler_list_two() {
    iconOff($(this));
    toggleListFunction();
    $(this).one("click", handler_list_one);
  }

  function toggleListFunction() {
    $(".comment-list").toggle(function() {
        $(".comment-list").animate({
          "right": "-15%"
        }, "fast");
      },
      function() {
        $(".comment-list").animate({
          "right": "0%"
        }, "fast");

      });
  }


  function iconOn(selector) {
    selector.off("mouseout");
    // selector.css("color", "#26A69A");
    selector.addClass('on-annotation').removeClass('off-annotation');
    selector.css('color', '#26A69A');
  }

  function iconOff(selector1, selector2, selector3, selector4) {

    var selector = (typeof(selector1) !== 'undefined' && typeof(selector2) !== 'undefined' && typeof(selector3) !== 'undefined' && typeof(selector4) !== 'undefined') ? selector1.add(selector2).add(selector3).add(selector4) : selector1;

    selector.off("mouseout");
    selector.off("click");
    selector.on("mouseout", function() {
      $(this).css("color", "white");
    });
    // selector.css("color", "white");
    selector.removeClass('on-annotation').addClass('off-annotation');
    selector.css('color', '#FFFFFF');
    selector.one("click", function() {
      handler_one($(this));
    });
  }

  /***

    Actions for bolding, striking, italicizing, underlining

  **/

  var underline = $(".mdi-editor-format-color-text");
  var italic = $(".mdi-editor-format-italic");
  var bold = $(".mdi-editor-format-bold");
  var strike = $(".mdi-editor-format-clear");
  var highlight = $('.mdi-editor-mode-edit');

  underline.one("click", function() {
    handler_one($(this));
  });
  strike.one("click", function() {
    handler_one($(this));
  });
  italic.one("click", function() {
    handler_one($(this));
  });
  bold.one("click", function() {
    handler_one($(this));
  });

  function handler_one(selector) {
    var cssStyle, cssColor = "#FEC324"; //  Default color if none of the above are selected...

    //  Underline On
    if (selector.is(underline)) {
      iconOff(highlight, italic, bold, strike);
      cssStyle = "underline";
      cssColor = "#FFFFFF";
    }
    //  Italicize On
    if (selector.is(italic)) {
      iconOff(highlight, underline, bold, strike);
      cssStyle = "italic";
      cssColor = "#FFFFFF";
    }
    //  Bold On
    if (selector.is(bold)) {
      iconOff(highlight, italic, underline, strike);
      cssStyle = "bold";
      cssColor = "#FFFFFF";
    }
    //  Strike-Through On
    if (selector.is(strike)) {
      iconOff(highlight, italic, bold, underline);
      cssStyle = "cross";
      cssColor = "#FFFFFF";
    }

    iconOn(selector);

    setNewActions(selector, cssStyle, cssColor, "handler_two");
  }

  //  Handler 2 deals with turning off the current annotation style and defaulting back to the highlighting feature.
  function handler_two(selector) {
    var cssStyle, cssColor = "#FEC324"; //  Default color if none of the above are selected...

    //  Underline On
    if (selector.is(underline)) iconOff(underline);
    //  Italicize On
    if (selector.is(italic)) iconOff(italic);
    //  Bold On
    if (selector.is(bold)) iconOff(bold);
    //  Strike-Through On
    if (selector.is(strike)) iconOff(strike);

    iconOn(highlight);

    setNewActions(selector, cssStyle, cssColor, "handler_one");
  }

  function setNewActions(selector, cssStyle, cssColor, handler) {
    //  Resetting actions is extremely important since old actions will carry on if they are not turned off.
    hoverActions();
    $(container).off('mouseup');
    $(container).off('mousedown');

    $(container).on('mouseup', function() {
      mouseupAction(0, cssColor, cssStyle);
    });

    $(container).on('mousedown', function() {
      unhighlightText();
    });

    (handler === "handler_one") ? selector.one("click", function() {
      handler_one($(this));
    }): selector.one("click", function() {
      handler_two($(this));
    });
  }

  function mouseupAction(parentRefFlag, cssColor, cssStyle) {
    $('.comment-area textarea').off("keyup");

    var selectedObj = highlightText(cssColor, cssStyle);
    if (parentRefFlag === 1) parentCSSRefPath = selectedObj.parentCSSPath;
    currentRef = insertComment(selectedObj);

    iconOn($('.mdi-editor-insert-comment'));

    if ($('.comment-area').css('right') === "-15%" || $('.comment-area').css('right') === "0%") {
      $(".comment-area").css("display", "block").animate({
        "right": "0%"
      }, "fast");
    }

    iconOn($('.mdi-action-view-headline'));
    iconOff($('.mdi-content-archive'));

    printComments(false, selectedObj);

    $('.comment-area textarea').focus();
    $('.comment-area textarea').keyup(function() {
      currentRef.update({
        comment: $('.comment-area textarea').val()
      }, onComplete);
      //  Need to reflect this change in real-time
    });
  }

  // Subselection of comments
  $(".mdi-action-view-headline").one("click", handler_subcomment_one);

  function handler_subcomment_one() {
    //  If it's currently white, let's turn on the icon.
    ($(this).hasClass('off-annotation')) ? iconOn($(this)): iconOff($(this));

    $(this).one("click", handler_subcomment_two);
  }

  function handler_subcomment_two() {
    ($('.mdi-action-view-headline').hasClass('on-annotation')) ? iconOff($('.mdi-action-view-headline')): iconOn($('.mdi-action-view-headline'));

    $('.mdi-action-view-headline').one("click", handler_subcomment_one);
  }

  //  Time to switch from subselection of comments to all comments
  $(".mdi-content-archive").one("click", handler_archive_one);

  function handler_archive_one() {
    //  Starts as white.
    //  If it's currently white, let's turn on the icon.
    ($(this).hasClass('off-annotation')) ? iconOn($(this)): iconOff($(this));

    printComments(true);

    $(this).one("click", handler_archive_two);
  }

  function handler_archive_two() {
    printAllFlag = false;
    ($('.mdi-content-archive').hasClass('on-annotation')) ? iconOff($('.mdi-content-archive')): iconOn($('.mdi-content-archive'));

    $('.mdi-content-archive').one("click", handler_archive_one);
  }

  function printComments(printFlag, selectedObj) {
    printAllFlag = printFlag;

    if ($('.comment-list').css('right') === "-15%" || $('.comment-list').css('right') === "0%") {
      $(".comment-list").css("display", "block").animate({
        "right": "0%"
      }, "fast");
    }

    //  Dump everything from the Firebase archive.
    $('.comment-list .collection').empty();

    if (typeof(selectedObj) !== 'undefined') {
      for (var property in internalCommentsDict) {
        var nameObj = internalCommentsDict[property];
        if (nameObj.parentPath == selectedObj.parentCSSPath && printAllFlag == false) //  Print comments for particular section.
          renderComments(property, nameObj);
      }
    } else {
      for (var property in internalCommentsDict) {
        var nameObj = internalCommentsDict[property]; //  Print all comments.
        renderComments(property, nameObj);
      }
    }
  }

  function renderComments(property, nameObj) {
    $('.comment-list .collection').append(
      '<a href="#!" class="collection-item" style="line-height:0.5rem;" id="' + property + '">' +
      "<strong>" + nameObj.twitterName + "</strong>" + ": " + "<br/>" + "<em style='color: #252525;'>Highlighted Text</em>" + ": " + "<br/>" + "<span class='highlighted-text'>" + nameObj.highlighted_text + "</span>" + "<br/>" + "<em style='color: #252525;''>Comment</em>" + ": " + "<br/>" + "<span class='comment-text'>" + nameObj.comment + "</span>" +
      '</li>'
    );
  }

}(window, jQuery));
