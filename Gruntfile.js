module.exports = function (grunt) {
    grunt.initConfig({
        jsdoc: {
            dist: {
                src: ['app/app_core/**/*.js','app/app_web_cam/**/*.js', 'app.js'],
                options: {
                    destination: 'docs'
                }
            }
        },

       
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.registerTask("default", ["jsdoc"]);
};
