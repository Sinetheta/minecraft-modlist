Session.setDefault('loading', true);

Meteor.subscribe('directory');
Meteor.subscribe('mods');

// Get current user in a template
Handlebars.registerHelper('user', function(){
    return Meteor.user();
});

// Determine if the app has loaded
Handlebars.registerHelper('isLoading', function(){
    return Session.get('loading');
});

Meteor.startup(function(){
    Session.set('loading', false);
});