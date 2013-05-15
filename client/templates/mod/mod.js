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
    'click .thumb-link': function(event, template) {
        var index = $(event.target).closest('a').index();
        var mod = Mods.find({ _id: Session.get('modId')}).fetch()[0];

        Session.set('focusImage', mod.images[index]);
        event.preventDefault();
    }
});
