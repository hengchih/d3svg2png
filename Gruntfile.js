module.exports = function (grunt) {
    grunt.initConfig({
        svg2png: {
            all: {
                // specify files in array format with multiple src-dest mapping
                files: [
                    // rasterize all SVG files in "img" and its subdirectories to "img/png"
                    { src: ['images/**/*.svg'], dest: 'images/png/' }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-svg2png');
    grunt.registerTask('default', ['svg2png']);
};