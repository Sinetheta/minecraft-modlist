Meteor.publish('directory', function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish('mods', function () {
  return Mods.find({}, {sort: {updated: -1}});
});
