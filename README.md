# Annotation Web Tool

This project features an independent JavaScript library for introducing an annotation web tool to a simple HTML5 web page. Users can comment on certain sections of the web page in real-time!

Began development on June 1, 2015.

Note: This library requires jQuery, Materialize and Firebase as dependencies. (Included via Bower!)

The user can make the following enriching annotations (besides standard commenting):
-	Line-through text
-	Highlight text via a yellow background
-	Bold text
-	Underline text
-	Italicize text

## Live Demo

[Visit the demo](http://kenchan23.github.io/AnnotationWebTool/app/index.html)

** The Materialize CSS framework works on all elements that are descendants of an element with the class ".container". Hence, when initiating the annotation tool using Annotate(selector), choose a selector that encapsulates all of the elements that contain content for annotating and does not include the class ".container" (using this class will allow the user to annotate the annotation tool). Still need to implement a check for this.

## Remaining Issues/Tasks

- Refactoring Code! 
- Support open annotation and rich text content.

