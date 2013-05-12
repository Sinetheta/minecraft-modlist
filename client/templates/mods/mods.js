// Create minimongo object
Mods = new Meteor.Collection('mods');

// Subscribe to 'servers' collection on startup.
var modsHandle = Meteor.subscribe('mods');

Template.mods.mods = function () {
    return Mods.find({}, {sort: {updated: -1}});
};

Handlebars.registerHelper('forge_icon', function(forge) {
    var icon = forge == 'yes'? '<span class="text-success"><i class="icon-ok"></i> Forge Compatible</span>':
        forge == 'no'? '<span class="text-error"><i class="icon-remove"></i> Not Forge Compatible</span>':
            '<span class="text-warning"><i class="icon-lock"></i> Forge Required</span>';

    return new Handlebars.SafeString(icon)
});

Handlebars.registerHelper('time_since', function(date) {
    return moment(date).fromNow();
});

Handlebars.registerHelper('cssify', function(str) {
    return str.replace(/[^a-z\d]/g, '');
});

Template.mods.mods = function() {
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