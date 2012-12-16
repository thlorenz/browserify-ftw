requirejs.config ({
    shim: {  
        'handlebars': { exports: 'Handlebars' } 
      , 'underscore': { exports: '_' }
    }
  , paths: {
      'jquery'               :  'vendor/jquery-1.8.0'
    , 'director'             :  'lib/director-1.1.3'
    , 'handlebars'           :  'lib/handlebars.runtime'
    }
});

require( 
  [ 'handlebars-templates' 
  , 'router'
  ]
);
