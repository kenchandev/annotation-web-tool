//  Comments can be edited in Firebase, but not on the front-end due to integrity issues.
(function(global, $) {

  //  Grab the parameters!
  var container = $("script#annotate").attr("container");
  var elements = $("script#annotate").attr("elements");
  //  Additional styles for "on" and "off" annotations and speech bubbles for listing comments.
  $("<style type='text/css'> .on-annotation{ color:#26A69A; } .off-annotation{ color:#FFFFFF;} .bubble{ position: relative; width: 250px; height: 350px; padding: 0px; background: #26A69A; -webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; } .bubble:after { content: ''; position: absolute; border-style: solid; border-width: 0px 20px 15px; border-color: #252525 transparent; display: block; width: 0; top: -14px; left: 105px; } </style>").appendTo("head");

  //  Create the annotation bar with icons...
  var annotationBar = document.createElement("div");

  annotationBar.className = "annotation"
  annotationBar.style.width = "5%";
  annotationBar.style.height = "12.8em"; //  8 icons, 1.6em each.
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
  var printAllFlag = false;
  var initialFlag = true;
  var clickSmallCommentIcon = false; //  Need to check if the user clicked on the comment icon. This is the legitimate method for making a comment with regards to the general scope of the paragraph.
  var commentsExistDict = {};
  var internalCommentsDict = {};
  var htmlTagListDict = {};

  // var last10Comments = commentsRef.limit(10);

  var bubbleContainer = $("<div></div>").addClass('bubble-items').appendTo($('body'));


  //  Append the overlay and the overall comments list...
  var overlay = $("<div></div>").attr('id', 'overlay').css({
    'height': '100%',
    'width': '95%',
    'position': 'fixed',
    'background-color': 'rgba(0,0,0,0.5)',
    'top': '0%',
    'left': '0%',
    'display': 'none'
  }).appendTo($('body'));
  var allCommentsList = $("<div></div>").addClass('container').attr('id', 'all-comments-list').css({
    'height': '50%',
    'width': '30%',
    'position': 'fixed',
    'top': '25%',
    'left': '35%',
    'background-color': '0px 0px 16px rgba(0,0,0,0.6)',
    'box-shadow': '0px 0px 16px rgba(0,0,0,0.6)',
    'display': 'none',
    'text-align': 'center',
    'overflow': 'scroll',
    'font-size': '8px',
    'padding': '0px',
    'border': '1px solid #e0e0e0'
  }).appendTo($('body'));
  var allListContainer = $("<ul></ul>").addClass('entire-collection collection').css({
    'border': 'none',
    'margin': '0px'
  }).appendTo(allCommentsList);
  var overallCounter = $('<div></div>').attr('id', 'overall-counter').css({
    'top': '15%',
    'height': '5%',
    'width': '5%',
    'position': 'fixed',
    'left': '49%',
    'font-size': '3rem',
    'color': 'white',
    'text-shadow': 'rgba(0, 0, 0, 0.6) 0px 0px 16px',
    'display': 'none'
  }).text(0).appendTo($('body'));

  //  Append comment icons to the end of each paragraph/header tag
  var iconsDivs = $("<i></i>").addClass("mdi-notification-sms-failed").css({
    'cursor': 'pointer',
    'font-size': '15px'
  }).appendTo(elements);

  var countComments = $("<b></b>").addClass("comment-count").css('font-size', '15px').text("0").appendTo(elements);
  //  Need this to color for exstence of comments in a section...
  $('i.mdi-notification-sms-failed').each(function(i) {
    commentsExistDict[getFullCSSPath($(this)[0].parentNode)] = $(this);
    var bubbleDiv = $('<div></div>').addClass('bubble').css('display', 'none').appendTo(bubbleContainer);

    //  For the comment area...
    var commentArea = $('<div></div>').addClass('comment-area').css({
      'background-color': '#252525',
      'width': '250px',
      'height': '100px',
      'padding': '0px 10px',
      'bottom': '0px',
      'text-align': 'center',
      'overflow': 'scroll',
      'color': 'white',
      'font-size': '8px',
      '-webkit-border-radius': '10px 10px 0px 0px',
      '-moz-border-radius': '10px 10px 0px 0px',
      'border-radius': '10px 10px 0px 0px'
    }).appendTo(bubbleDiv);
    var inputField = $("<div></div>").addClass('input-field').appendTo(commentArea);
    var textArea = $("<textarea></textarea>").addClass('materialize-textarea').attr('id', 'textarea1').appendTo(inputField);
    var labelTextArea = $("<label></label>").attr('for', 'textarea1').text('Comment').appendTo(inputField);
    var addButton = $("<a></a>").addClass("btn-floating btn-large waves-effect waves-light").css({
      "position": "absolute",
      "top": "0rem",
      "right": "0.1rem",
      "width": "20px",
      "height": "20px",
      "z-index": "0"
    }).appendTo(inputField);
    var addButtonIcon = $("<i></i>").addClass("mdi-content-add").css({
      "line-height": "20px",
      "bottom": "5px",
      "position": "relative",
      "bottom": "12px",
      "font-size": "1.3rem"
    }).appendTo(addButton);

    //  For the comment box...

    var commentList = $('<div></div>').addClass('comment-list container').css({
      'width': '250px',
      'height': '250px',
      'top': '0px',
      'text-align': 'center',
      'overflow': 'scroll',
      'color': 'white',
      'font-size': '8px',
      'padding': '0px',
      'border': '1px solid #e0e0e0',
      '-webkit-border-radius': '0px 0px 10px 10px',
      '-moz-border-radius': '0px 0px 10px 10px',
      'border-radius': '0px 0px 10px 10px'
    }).appendTo(bubbleDiv);
    var listContainer = $("<ul></ul>").addClass('collection').css({
      'border': 'none',
      'margin': '0px'
    }).appendTo(commentList);

    var index = $("i.mdi-notification-sms-failed").index(this);
    htmlTagListDict[getFullCSSPath($(this)[0].parentNode)] = $('.bubble-items .bubble:nth-of-type(' + (index + 1) + ')');
  });

  //  Set the action listener for the button
  function setCommentIconAction() {
    $('.bubble-items .bubble').hide();
    var index = $("i.mdi-notification-sms-failed").index(this);
    var position = $(this).position();
    var width = $(this).width(); //  Take into account additional padding/margins
    $('.bubble-items .bubble:nth-of-type(' + (index + 1) + ')').css({
      position: "absolute",
      top: (position.top + 30) + "px",
      left: (position.left - Math.floor(250 / 2) + 7) + "px" //  Half of the width of the comment box...
    }).show();
  }

  $('i.mdi-notification-sms-failed').one("click", setCommentIconAction);

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

  function highlightText(hexColor, fontStyle, selection) {
    //  Clear the old comment
    var rangeSelection;
    $('.materialize-textarea').val("");
    if (typeof(selection) == 'undefined')
      rangeSelection = window.getSelection().getRangeAt(0);
    else
      rangeSelection = selection;
    var selectedText = rangeSelection.extractContents();
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
    rangeSelection.insertNode(span);

    var actualText = (typeof(selection) == 'undefined') ? span.innerText : "";

    return {
      selection: rangeSelection,
      spanStyles: spanStyles,
      selectionObject: rangeSelection,
      text: actualText,
      parentCSSPath: getFullCSSPath(span.parentNode),
      currentCSSPath: getFullCSSPath(span)
    };
  }

  function unhighlightText() {
    $('#text-box').find('.selected-text').contents().unwrap();
  }

  $(elements).on('mouseup', function(e) {
    if ($(e.target).hasClass('mdi-notification-sms-failed')) {
      console.log("Somewhere over the rainbow...");
      clickSmallCommentIcon = true;
      mouseupAction('#90CAF9');
    } else
      mouseupAction('#FEC324');
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
    } else {
      if (clickSmallCommentIcon) {
        clickSmallCommentIcon = false; //  resetting this...
        return commentsRef.push({
          spanStyles: selectedObj.spanStyles,
          selectionObject: selectedObj.selectionObject,
          twitterUserID: twitterUserID,
          twitterName: twitterName,
          twitterHandle: twitterHandle,
          highlighted_text: "** General **",
          comment: "",
          path: selectedObj.currentCSSPath,
          parentPath: selectedObj.parentCSSPath
        });
      } else {
        return false;
      }
    }
  }

  $(elements).on('mousedown', function() {
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

    if (item.parentPath === parentCSSRefPath || initialFlag === true) {
      var bubbleElement = htmlTagListDict[item.parentPath];

      renderComments(name, item, bubbleElement.selector);
      renderComments(name, item, '.entire-collection');

      var singleCount = parseInt($(item.parentPath + ' ' + '.comment-count').text()) + 1;
      $(item.parentPath + ' ' + '.comment-count').text(singleCount);
      var overallCount = parseInt($('#overall-counter').text()) + 1;
      $('#overall-counter').text(overallCount);

      var scrollSingle = $(bubbleElement.selector + ' ' + '.comment-list')[0].scrollHeight; //  [0] for DOM object.
      $(bubbleElement.selector + ' ' + '.comment-list').animate({
        scrollTop: scrollSingle
      }, 'fast');

      var scrollOverall = $('#all-comments-list')[0].scrollHeight;
      $('#all-comments-list').animate({
        scrollTop: scrollOverall
      }, 'fast');


    }
    if (item.parentPath in commentsExistDict)
      $('i.mdi-notification-sms-failed').filter(function(i) {
        return $(this).is(commentsExistDict[item.parentPath]);
      }).css('color', '#26A69A');
  });

  commentsRef.on('child_changed', function(snapshot) {
    var comment = snapshot.val().comment;
    var name = snapshot.name().substring(1);
    $("." + name + " span.comment-text").text(comment);
    internalCommentsDict[name].comment = comment;
  });

  commentsRef.on("child_removed", function(snapshot) {
    var name = snapshot.name().substring(1);
    $("." + name).remove();

    var count = parseInt($(snapshot.val().parentPath + ' ' + '.comment-count').text()) - 1;
    $(snapshot.val().parentPath + ' ' + '.comment-count').text(count);
    var overallCount = parseInt($('#overall-counter').text()) - 1;
    $('#overall-counter').text(overallCount);

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
    ($(this).hasClass('off-annotation')) ? iconOn($(this)): (iconOff($(this)), $('.bubble-items .bubble textarea').blur(), $('.bubble-items .bubble').hide());

    $(this).one("click", handler_comment_two);
  }

  function handler_comment_two() {
    ($(this).hasClass('off-annotation')) ? iconOn($(this)): (iconOff($(this)), $('.bubble-items .bubble textarea').blur(), $('.bubble-items .bubble').hide());

    $(this).one("click", handler_comment_one);
  }

  //  Handling archival comments
  $(".mdi-content-archive").one("click", handler_archive_one);

  function handler_archive_one() {
    //  Starts as white.
    //  If it's currently white, let's turn on the icon.
    ($(this).hasClass('off-annotation')) ? iconOn($(this)): iconOff($(this));

    printComments(true, undefined, '.entire-collection');

    $(this).one("click", handler_archive_two);
  }

  function handler_archive_two() {
    // printAllFlag = false;
    ($(this).hasClass('off-annotation')) ? iconOn($(this)): iconOff($(this));

    printComments(false, undefined, '.entire-collection');

    $(this).one("click", handler_archive_one);
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

    selector.on("mouseout", function() {
      $(this).css("color", "white");
    });
    // selector.css("color", "white");
    selector.removeClass('on-annotation').addClass('off-annotation');
    selector.css('color', '#FFFFFF');
    if (!selector.hasClass('mdi-content-archive')) {
      selector.off("click");
      selector.one("click", function() {
        handler_one($(this));
      });
    }
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
    $(elements).off('mouseup');
    $(elements).off('mousedown');

    $(elements).on('mouseup', function(e) {
      cssColor = ($('.mdi-editor-format-bold').hasClass('off-annotation') && $('.mdi-editor-format-italic').hasClass('off-annotation') && $('.mdi-editor-format-color-text').hasClass('off-annotation') && $('.mdi-editor-format-clear').hasClass('off-annotation')) ? "#FEC324" : "#FFFFFF"; //  if all off, then set the highlight color to defult yellow-orange
      console.log(cssColor);
      if ($(e.target).hasClass('mdi-notification-sms-failed')) {
        console.log("Inside here...");
        cssColor = '#90CAF9';
        clickSmallCommentIcon = true;
        cssStyle = undefined;
      }
      mouseupAction(cssColor, cssStyle);
    });

    $(elements).on('mousedown', function() {
      unhighlightText();
    });

    (handler === "handler_one") ? selector.one("click", function() {
      handler_one($(this));
    }): selector.one("click", function() {
      handler_two($(this));
    });
  }

  function mouseupAction(cssColor, cssStyle, selection) {
    var selectedObj = highlightText(cssColor, cssStyle, selection);
    console.log("Selected Object", selectedObj);
    parentCSSRefPath = selectedObj.parentCSSPath; //  global.
    var parentBubbleSelector = htmlTagListDict[selectedObj.parentCSSPath].selector;

    if (clickSmallCommentIcon) { //  IF the user has just click on the comment icon, they should only be able to see the icon. However, once the comments finish loading, if the user wishes to add a comment, then he/she must type into the text box...
      $(parentBubbleSelector + ' ' + 'textarea').focus();
      var oldValue = "";

      $(parentBubbleSelector + ' ' + '.comment-area textarea').off('change keyup paste');
      $(parentBubbleSelector + ' ' + 'textarea').on('change keyup paste', function() {
        var currentValue = $(this).val();
        if (currentValue != oldValue) {
          oldValue = currentValue;
          $(this).off('change keyup paste');
          bubbleActions(selectedObj, parentBubbleSelector);
        }
      });
    } else {
      bubbleActions(selectedObj, parentBubbleSelector);
    }
  }

  function bubbleActions(selectedObj, parentBubbleSelector) {
    currentRef = insertComment(selectedObj);

    if (currentRef) {
      //  Turn off any bubble coments, and then turn it back on!

      $(parentBubbleSelector + ' ' + '.comment-area textarea').off("keyup");
      $('i.mdi-notification-sms-failed').off("click");
      $('i.mdi-notification-sms-failed').one("click", setCommentIconAction);

      iconOn($('.mdi-editor-insert-comment'));
      iconOff($('.mdi-content-archive'));
      // setCommentIconAction(false);

      // printComments(true, selectedObj, parentBubbleSelector);

      var position = $(selectedObj.parentCSSPath + ' ' + 'i.mdi-notification-sms-failed').position();
      var width = $(selectedObj.parentCSSPath + ' ' + 'i.mdi-notification-sms-failed').width();

      $('.bubble-items .bubble').hide();
      htmlTagListDict[selectedObj.parentCSSPath].css({
        position: "absolute",
        top: (position.top + 30) + "px",
        left: (position.left - Math.floor(250 / 2) + 7) + "px" //  Half of the width of the comment box...
      }).show();

      var scrollValue = $(parentBubbleSelector + ' ' + '.comment-list')[0].scrollHeight;
      $(parentBubbleSelector + ' ' + '.comment-list').animate({
        scrollTop: scrollValue
      }, 'fast');

      $(parentBubbleSelector + ' ' + '.comment-area textarea').focus();
      $(parentBubbleSelector + ' ' + '.comment-area textarea').keyup(function() {
        currentRef.update({
          comment: $(parentBubbleSelector + ' ' + '.comment-area textarea').val()
        }, onComplete);
        //  Need to reflect this change in real-time
      });

      $(parentBubbleSelector + ' ' + '.mdi-content-add').off('click');
      $(parentBubbleSelector + ' ' + '.mdi-content-add').on('click', function() {
        bubbleAddButton(parentBubbleSelector);
      });

      function bubbleAddButton(parentBubbleSelector) {
        $(parentBubbleSelector + ' ' + '.comment-area textarea').val("");
        clickSmallCommentIcon = true;
        mouseupAction('#90CAF9', undefined, selectedObj.selection);
      }
    }
  }

  //  Time to switch from subselection of comments to all comments


  function printComments(printFlag, selectedObj, parentBubbleSelector) {
    printAllFlag = printFlag;

    if (printAllFlag == true) {
      $('#overlay').show();
      $('#all-comments-list').show();
      $('#overall-counter').show();
    } else {
      $('#overlay').hide();
      $('#all-comments-list').hide();
      $('#overall-counter').hide();
    }

  }

  function renderComments(property, nameObj, parentBubbleSelector) {
    var annotationMethod;
    var rawBackgroundColor = nameObj.spanStyles.backgroundColor;
    var backgroundColor = (rawBackgroundColor == "#FEC324" || rawBackgroundColor == "#90CAF9") ? "background-color:" + nameObj.spanStyles.backgroundColor + ';' : '';
    var collectionDiv;

    if (nameObj.spanStyles.backgroundColor == "#FEC324")
      annotationMethod = "Highlighted Text";
    else if (nameObj.spanStyles.fontStyle == "italic")
      annotationMethod = "Italicized Text";
    else if (nameObj.spanStyles.fontWeight == "bold")
      annotationMethod = "Bolded Text";
    else if (nameObj.spanStyles.textDecoration == "line-through")
      annotationMethod = "Striked Text";
    else if (nameObj.spanStyles.textDecoration == "underline")
      annotationMethod = "Underlined Text";
    else
      annotationMethod = "No Text Selected";

    if (parentBubbleSelector == '.entire-collection')
      collectionDiv = $('.entire-collection');
    else
      collectionDiv = $(parentBubbleSelector + ' ' + '.comment-list .collection')

    collectionDiv.append('<a href="#!" class="collection-item" style="line-height:0.7rem; font-size:10px;" class="' + property + '">' + "<strong style='display:inline-block; float:right;'>" + nameObj.twitterName + "</strong>" + "<br/>" + "<span>" + annotationMethod + "</span>" + ": " + "<br/>" + "<span class='highlighted-text' style='color:#252525; " + backgroundColor + " font-style:" + nameObj.spanStyles.fontStyle + "; font-weight:" + nameObj.spanStyles.fontWeight + "; text-decoration:" + nameObj.spanStyles.textDecoration + ";'>" + nameObj.highlighted_text + "</span>" + "<br/>" + "<span>Comment</span>" + ": " + "<br/>" + "<span class='comment-text' style='color:#252525;'>" + nameObj.comment + "</span>" +
      '</li>'
    );
  }

}(window, jQuery));
