// TODO: SORT THIS OUT
Template.mod.mods = function(){
    return Mods.find({ _id: Session.get('modId')}).fetch();
}
