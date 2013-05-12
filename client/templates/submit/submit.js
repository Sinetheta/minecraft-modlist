Template.submit.events({
    'click #login-reveal': function() {
        setTimeout(function(){$('.dropdown-toggle').click();});
    }
});

Template.submit.rendered = function() {
    $('#inputSupports').select2();
    $('#inputForge').select2({
        //we include bootstrap icons in the options
        escapeMarkup: function(m) { return m; }
    });
    $('#inputAvailability').select2();
}