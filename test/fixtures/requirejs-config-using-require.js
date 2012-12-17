require.config({ 
    jQuery: '1.7.2',
    paths: {
        'jquery': 'modules/jquery'
    },
    map: {
        '*': {
            'jquery': 'modules/adapters/jquery'
        },
        'modules/adapters/jquery': {
            'jquery': 'jquery'
        }
    }
});
