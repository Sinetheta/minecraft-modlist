// if the database is empty on server start, create some sample data.
/*
Meteor.startup(function() {
    if (Mods.find().count() === 0) {
        var data = [{
            name: "BuildCraft",
            version: '3.5.0',
            author: 'SirSengir',
            supports: ['1.5.1'],
            compatibility: ['universal','forge'],
            updated: 1367478014836,
            description: 'Adds machines which can be powered by engines and fuel to help build and/or dig!'
        }, {
            name: 'IndustrialCraft 2',
            version: '1.115',
            author: 'Alblaka',
            supports: ['1.5.1'],
            compatibility: ['universal','forge'],
            updated: 1367909850041,
            description: 'Adds many blocks and items for both crafting and to find whilst exploring, adding the ability to industrialize your Minecraft life with electricity and various means of increasing efficiency for the materials you’ve collected.'
        }];

        for (var i = 0; i < data.length; i++) {
            Mods.insert(data[i]);
        }
    }
});
*/