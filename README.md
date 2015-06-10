# Annotation Web Tool
 
This project features an independent JavaScript library for introducing an annotation web tool to a simple HTML5 web page. Users can comment on certain sections of the web page in real-time!

Assumption: The use case is a simple HTML5 webpage. Developed on a standard laptop and supports all major browsers (Chrome, Firefox, Safari, IE).

Began development on June 1, 2015.

Note: This library requires jQuery, Materialize and Firebase as dependencies. These dependencies were formerly included via Bower, but one of the requirements was to include only a single 

The user can make the following enriching annotations (besides standard commenting):
-	Line-through text
-	Highlight text via a yellow background
-	Bold text
-	Underline text
-	Italicize text

There are three components to the tool:
-	A small icon is appended to the tags specified within the "elements" attribute of the script tag. When this small icon is clicked on, a list of comments and a textarea field are displayed for that particular section.
-	The side-panel features all the tools for enriching annotations and toggling off any comment panels displayed on the screen. Furthermore, there is support for Twitter logins, which allows users to distinguish their comments from other users' comments.
-	An archival icon on the fixed side-panel enables the user to see the total number of comments added along with a list of all the comments. This number and list are updated in real-time if other users accessing the same application add comments.

Within the side-panel, there are nine icons (from top to bottom):
-	Twitter login
-	Toggling off comments / Indicating if any comment panels are shown on the webpage
-	Highlight text
-	Bold text
-	Italicize text
-	Underline text
-	Line-through text
-	Print all comments for the webpage in a panel overlaid over the webpage.

To see the comments for a particular section (for content within a particular element tag), simply click the corresponding icon appended to it and get a list of comments.

Comments are automatically added as soon as the user enters in text into the textarea. The "plus" button clears the current text in the textarea and refocuses to the textarea to allow the user to write another comment easily.

Being able to toggle allows the tool to be non-intrusive as the user reads a webpage.

## Live Demo

[Visit the demo](http://kenchan23.github.io/AnnotationWebTool/app/index.html)

** The Materialize CSS framework works on all elements that are descendants of an element with the class ".container". Hence, choose a selector that encapsulates all of the elements that contain content for annotating and does not include the class ".container" (using this class will allow the user to annotate the annotation tool). Still need to implement a check for this.

** Some custom styles are overridden on the webpage via the Materialize CSS framework due to the priority indicated by !important declarations.

## Remaining Issues/Tasks

- Refactoring Code! (Codebase is messy, but most of the commenting and refactoring will happen in the next couple of days to ensure readability and ease future developments)
- Support open annotation and rich text content.

## Running Locally After Cloning

grunt && ./execute.sh

