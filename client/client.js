Template.modsTable.mods = function () {
    return Mods.find({}, {sort: {name: 1}});
};

Handlebars.registerHelper('time_since', function (date) {
    return moment(date).fromNow();
});

Handlebars.registerHelper('cssify', function (str) {
    return str.replace(/[^a-z\d]/g, '');
});

