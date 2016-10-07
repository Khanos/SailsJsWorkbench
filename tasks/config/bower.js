module.exports = function(grunt) {

  grunt.config.set('bower', {
    dev: {
        dest: 'assets/',
        js_dest: 'assets/js',
        css_dest: 'assets/styles',
        fonts_dest: 'assets/fonts/',
        options: {
            packageSpecific: {
                bootstrap: {
                    files: [
                        "dist/css/bootstrap.css"
                    ]
                }
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-bower');
};
