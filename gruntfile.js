module.exports = function (grunt) {
  grunt.initConfig({
		jsbeautifier: {
      files: ["app/js/annotate_load.js", "app/js/annotate.js"],
      options: {
        css: {
          indentChar: " ",
          indentSize: 2
        },
        js: {
              braceStyle: "collapse",
              breakChainedMethods: false,
              e4x: false,
              evalCode: false,
              indentChar: " ",
              indentLevel: 0,
              indentSize: 2,
              indentWithTabs: false,
              jslintHappy: false,
              keepArrayIndentation: false,
              keepFunctionIndentation: false,
              maxPreserveNewlines: 1000,
              preserveNewlines: true,
              spaceBeforeConditional: true,
              spaceInParen: false,
              unescapeStrings: false,
              wrapLineLength: 0
          }
      }
    },
    uglify: {
      my_target: {
        files: {
					'app/js/annotate_load.min.js': ['app/js/annotate_load.js'],
          'app/js/annotate.min.js': ['app/js/annotate.js']
        }
      }
    }	
  });

  grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jsbeautifier', 'uglify']);
};
