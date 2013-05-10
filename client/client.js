Session.set('showLoginWarningDialog', false);
Session.set('showCreateDialog', false);

Template.page.events({
    'click .add.disabled': function() {
        Session.set('showLoginWarningDialog', true);
    },
    'click .add:not(.disabled)': function(event, template) {
        Session.set('showCreateDialog', true);
    }
});

Template.page.showLoginWarningDialog = function() {
    return Session.get('showLoginWarningDialog');
};

Template.loginWanringDialog.events({
    'click .okay': function() {
        Session.set('showLoginWarningDialog', false);
    }
});

Template.modsTable.mods = function() {
    return Mods.find({}, {
        sort: {
            name: 1
        }
    });
};

Template.modRow.isOwner = function() {
    return this.owner === Meteor.userId();
};

Template.modRow.events({
    'click .delete': function() {
        Meteor.call('deleteMod', this._id);
    }
});

Handlebars.registerHelper('time_since', function(date) {
    return moment(date).fromNow();
});

Handlebars.registerHelper('cssify', function(str) {
    return str.replace(/[^a-z\d]/g, '');
});

Meteor.subscribe('directory');
Meteor.subscribe('mods');


///////////////////////////////////////////////////////////////////////////////
// Create Mod dialog

Template.page.showCreateDialog = function() {
    return Session.get('showCreateDialog');
};

Template.createDialog.events({
    'click .save': function(event, template) {
        var title = template.find('[name="title"]').value;
        var version = template.find('[name="version"]').value;
        var author = template.find('[name="author"]').value;
        var description = template.find('[name="description"]').value;
        var supports = template.find('[name="supports"]').value;
        var compatibility = $(template.find('[name="compatibility"]')).val();

        if (title.length && description.length) {
            Meteor.call('createMod', {
                title: title,
                version: version,
                author: author,
                description: description,
                supports: supports,
                compatibility: compatibility
            }, function(error, mod) {
                if (!error) {
                    Session.set('selected', mod);
                }
            });
            Session.set('showCreateDialog', false);
        } else {
            Session.set('createError', 'It needs a title and a description, or why bother?');
        }
    },

    'click .cancel': function() {
        Session.set('showCreateDialog', false);
    }
});

Template.createDialog.error = function() {
    return Session.get('createError');
};