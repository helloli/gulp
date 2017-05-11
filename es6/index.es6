require.config({
    paths: {
        // 'bootstrap': 'node_modules/bootstrap/dist/js/bootstrap.min',
        // 'jQuery': 'node_modules/jquery/dist/jquery.min',
        // 'vue-touch': 'node_modules/vue-touch/vue-touch'
    },
    shim: {
        // 'jQuery': {
        //     exports: 'jQuery'
        // },
        // 'bootstrap': {
        //     deps: ['jQuery']
        // },
        // 'vue-touch': {
        //     deps: ['hammerjs']
        // }
    },
    packages:[]
    // [{
    //     name: 'vue',
    //     location: 'node_modules/vue',
    //     main: 'dist/vue.min'
    // }, {
    //     name: 'text',
    //     location: 'node_modules/text',
    //     main: 'text'
    // }, {
    //     name: 'css',
    //     location: 'node_modules/require-css',
    //     main: 'css.min'
    // }, {
    //     name: 'hammerjs',
    //     location: 'node_modules/hammerjs',
    //     main: 'hammer.min'
    // }, {
    //     name: 'infiniteScroll',
    //     location: 'node_modules/vue-infinite-scroll',
    //     main: 'vue-infinite-scroll'
    // }]
});
console.log('yes');

require(['apps/index']);