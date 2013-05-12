Session.set('showSuccessDialog', false);

Template.submit.showSuccessDialog = function() {
    return Session.get('showSuccessDialog');
};

Template.submit.events({
    'click #login-reveal': function() {
        setTimeout(function(){$('.dropdown-toggle').click();});
    },
    'click #submit-mod': function(event, template) {
        event.preventDefault();
        var title = template.find('[name="title"]').value;
        var version = template.find('[name="version"]').value;
        var author = template.find('[name="author"]').value;
        var description = template.find('[name="description"]').value;
        var supports = template.find('[name="supports"]').value;
        var forge = $(template.find('[name="forge"]')).val();
        var availability = $(template.find('[name="availability"]')).val();

        event.preventDefault();

        if (title.length && description.length) {
            Meteor.call('createMod', {
                title: title,
                version: version,
                author: author,
                description: description,
                supports: supports,
                forge: forge,
                availability: availability
            }, function(error, mod) {
                if (!error) {
                    Session.set('showSuccessDialog', true);
                }
            });
        } else {
            //Session.set('createError', 'It needs a title and a description, or why bother?');
        }
    }
});

Template.submit.rendered = function() {
    $('#inputSupports').select2();
    $('#inputForge').select2({
        //we include bootstrap icons in the options
        escapeMarkup: function(m) { return m; }
    });
    $('#inputAvailability').select2();
}