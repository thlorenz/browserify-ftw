requirejs.config ({
    shim: {  
        'handlebars': { exports: 'Handlebars' } 
      , 'underscore': { exports: '_' }
    }
  , paths: {
      'jquery'     :  'vendor/jquery-1.8.0'
    , 'director'   :  'lib/director-1.1.3'
    , 'handlebars' :  'handlebars.runtime'
    , 'hbs'        :  'lib/specific/hbs'
    , 'underscore' :  null
    }
});

require( 
  [ 'handlebars-templates' 
  , 'router'
  ]
);
