////////// Routes with Backbone //////////

// Extend backbone router
var AppRouter = Backbone.Router.extend({
    routes: {
        '': 'index',
        'mod/:id': 'mod',
        'submit': 'submit'
    },
    index: function () {
        Session.set('action', 'index');
    },
    submit: function(){
        Session.set('action', 'submit');
    },
    mod: function(id){
        Session.set('modId', id);
        Session.set('action', 'mod');
    }
});

// Create router instance
Router = new AppRouter;

/**
 * Global template helper function to check the current route in a template.
 */
Handlebars.registerHelper('routeIs', function(target){
    return Session.get('action') === target;
});


// Retrieve template for current page
Template.page_controller.current_page = function(){
    var action = Session.get('action');

    // Check template exists
    if(Template[action]){
        return Template[action]();
    }else{
        return Template['404']();
    }
};

Meteor.startup(function () {
    Backbone.history.start({pushState: true});
});