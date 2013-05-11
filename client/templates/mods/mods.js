// Create minimongo object
Mods = new Meteor.Collection('mods');

// Subscribe to 'servers' collection on startup.
var modsHandle = Meteor.subscribe('mods');

Template.mods.mods = function () {
    return Mods.find({}, {sort: {updated: -1}});
};