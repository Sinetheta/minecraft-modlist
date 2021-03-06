/*
  Each mod is represented by a document in the Mods collection:
    owner: user id
    title, version, autor, description: String
    created, updated: Number
    supports: String, latest compatible version of Minecraft
    compatibility: Array of strings, compatible environments
*/
Mods = new Meteor.Collection('mods');

Mods.allow({
    insert: function(userId, mod) {
        return false; // no cowboy inserts -- use createMod method
    },
    update: function(userId, mod, fields, modifier) {
        if (userId !== mod.owner) return false; // not the owner

        var allowed = ['title', 'version', 'author', 'description', 'supports', 'forge', 'availability'];
        if (_.difference(fields, allowed).length) return false; // tried to write to forbidden field

        // A good improvement would be to validate the type of the new
        // value of the field (and if a string, the length.) In the
        // future Meteor will have a schema system to makes that easier.
        return true;
    },
    remove: function(userId, mod) {
        // You can only remove mods that you created and nobody is going to.
        return mod.owner === userId;
    }
});

Meteor.methods({
    // TODO: extract this and validate edits too
    createMod: function(options) {
        options = options || {};
    /*if (! (typeof options.title === 'string' && options.title.length))
      throw new Meteor.Error(400, 'Required parameter missing');
    if (options.title.length > 100)
      throw new Meteor.Error(413, 'Title too long');
    if (options.version.length > 10)
      throw new Meteor.Error(413, 'Version too long');
    if (options.author.length > 100)
      throw new Meteor.Error(413, 'Author too long');
    if (options.supports.length > 10)
      throw new Meteor.Error(413, 'Supports too long');
    if (options.description.length > 2000)
      throw new Meteor.Error(413, 'Description too long');
    if (options.compatibility.length > 20)
      throw new Meteor.Error(413, 'Too many compatibilities');
    if (_.find(options.compatibility, function(str){ return str.length > 20; }))
      throw new Meteor.Error(413, 'A compatibility was too long');
      */
        if (!this.userId) throw new Meteor.Error(403, 'You must be logged in');

        return Mods.insert({
            owner: this.userId,
            title: options.title,
            version: options.version,
            author: options.author,
            supports: options.supports,
            description: options.description,
            forge: options.forge,
            availability: options.availability,
            images: options.images,
            featureImage: options.featureImage,
            download: options.download,
            created: (new Date()).getTime(),
            updated: (new Date()).getTime()
        });
    },
    editMod: function(modId, options) {
        options = options || {};

        return Mods.update({
            title: options.title,
            version: options.version,
            author: options.author,
            supports: options.supports,
            description: options.description,
            forge: options.forge,
            availability: options.availability,
            images: options.images,
            featureImage: options.featureImage,
            updated: (new Date()).getTime()
        });
    },
    deleteMod: function(modId) {
        return Mods.remove(modId);
    }
});

Meteor.publish('mods', function(filter, skip, limit) {
    return Mods.find(filter || {}, {
        sort: {
            updated: 1
        },
        skip: skip || 0,
        limit: limit || 0,
    });
});

Meteor.methods({
    modCount: function(filter, skip, limit) {
        return Mods.find(filter || {}, {
            sort: {
                updated: 1
            },
            skip: skip || 0,
            limit: limit || 0,
        }).count();
    }
});
