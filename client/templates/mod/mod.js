Session.set('focusImage', null);

Template.mod.mod = function(){
    return Mods.find({ _id: Session.get('modId')}).fetch()[0];
}

Template.mod.focusImage = function() {
    var focusImage = Session.get('focusImage');
    var mod = Mods.find({ _id: Session.get('modId')}).fetch()[0];

    return focusImage? focusImage: mod.featureImage;
};

Template.mod.events({
    'click .thumb-link': function focusImage(event, template) {
        var index = $(event.target).closest('a').index();
        var mod = Mods.find({ _id: Session.get('modId')}).fetch()[0];

        Session.set('focusImage', mod.images[index]);
        event.preventDefault();
    }/*,
    'click .nav-tabs a': function showTab(event) {
        var targetId = $(event.currentTarget).attr('href');

        $('.tab-pane').removeClass('active');
        $(targetId).addClass('active');

        event.preventDefault();
    }*/
});

Handlebars.registerHelper('time_readable', function(date) {
    return moment(date).format('ll');
});

Handlebars.registerHelper('latest', function(download) {
    return download? download[0].url: '#';
});

Handlebars.registerHelper('markdown_to_html', function(md) {
    return markdown.toHTML(md);
});
