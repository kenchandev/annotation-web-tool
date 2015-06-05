# Annotation Web Tool

This project features an independent JavaScript library for introducing an annotation web tool to a simple HTML5 web page. Users can comment on certain sections of the web page in real-time!

Assumption: The use case is a simple HTML5 webpage. Developed on a standard laptop.

Began development on June 1, 2015.

Note: This library requires jQuery, Materialize and Firebase as dependencies. (Included via Bower!)

The user can make the following enriching annotations (besides standard commenting):
-	Line-through text
-	Highlight text via a yellow background
-	Bold text
-	Underline text
-	Italicize text

There are three components to the tool:
-	The top panel allows the user to write a comment for a selected piece of text.
-	The middle panel features all the tools for enriching annotations and toggling the top and bottom panels. Furthermore, there is support for Twitter logins, which will allow users to distinguish their comments from other users' comments.
-	The bottom panel allows the user to either see comments within a certain section or all the comments for the webpage.

Within the middle panel, there are nine icons (from top to bottom):
-	Twitter Login
-	Toggling top panel
-	Highlight text
-	Bold text
-	Italicize text
-	Underline text
-	Line-through text
-	Toggling bottom panel
-	Print all comments for the webpage in bottom panel

To see the comments for a particular section (for content within a particular element tag), simply click the section or select a piece of text from the section for commenting.

Being able to toggle allows the tool to be non-intrusive as the user reads a webpage.

## Live Demo

[Visit the demo](http://kenchan23.github.io/AnnotationWebTool/app/index.html)

** The Materialize CSS framework works on all elements that are descendants of an element with the class ".container". Hence, when initiating the annotation tool using Annotate(selector), choose a selector that encapsulates all of the elements that contain content for annotating and does not include the class ".container" (using this class will allow the user to annotate the annotation tool). Still need to implement a check for this.

## Remaining Issues/Tasks

- Refactoring Code! 
- Support open annotation and rich text content.

## Running Locally After Cloning

grunt && ./execute.sh

