module.exports = function(grunt) {
	grunt.initConfig({

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/scripts/dropdown.js', 'js/scripts/scripts.js', 'js/scripts/customselect.js', 'js/scripts/modals.js', 'js/scripts/validator.js', 'js/scripts/ajax.js'],
        dest: 'js/blog.js',
      },
    },

    uglify: {
      my_target: {
        files: {
          'js/blog.min.js': ['js/blog.js']
        }
      }
    },

  	less: {
      development: {
        options: {
          compress: true
        },
        files: {
          "css/blog.min.css": "less/blog.less" // destination file and source file
        }
      }
    },

    watch: {
      styles: {
        files: ['less/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }

	})
	
	grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['less', 'watch']);
}