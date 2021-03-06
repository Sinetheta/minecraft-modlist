
///////////////////////////////////////////////////////////////////////////////
// Users

displayName = function(user) {
    if (user.profile && user.profile.name) return user.profile.name;
    return user.emails[0].address;
};

var contactEmail = function(user) {
    if (user.emails && user.emails.length) return user.emails[0].address;
    if (user.services && user.services.facebook && user.services.facebook.email) return user.services.facebook.email;
    return null;
};

Meteor.publish('directory', function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});
