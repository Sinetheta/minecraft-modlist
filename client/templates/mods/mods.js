// Create minimongo object
Mods = new Meteor.Collection('mods');

// Subscribe to 'servers' collection on startup.
Meteor.modsHandle = Meteor.subscribe('mods');

Session.set('pagingFilter', {});
Session.set('pagingSkip', 0);
Session.set('pagingLimit', 3);
Session.set('totalRecords', 0);

Meteor.call('modCount', Session.get('pagingFilter'), Session.get('pagingSkip'), Session.get('pagingLimit'), function(err, result) {
    Session.set('totalRecords', result);
});

Template.mods.mods = function() {
    return Mods.find(Session.get('pagingFilter'),
        {
        sort: {
            updated: -1
        },
        skip: Session.get('pagingSkip'),
        limit: Session.get('pagingLimit')
    });
};

Template.mods.events({
    'change': function(event, template) {
        var forge = $('#inputForge').val();
        var availability = $('#inputAvailability').val();
        var filter = {};

        if(forge) filter.forge = forge;
        if(availability) filter.availability = { $all: [availability] };

        Session.set('pagingFilter', filter);
        Meteor.call('modCount', Session.get('pagingFilter'), Session.get('pagingSkip'), Session.get('pagingLimit'), function(err, result) {
            Session.set('totalRecords', result);
        });
    }
});

Handlebars.registerHelper('forge_icon', function(forge) {
    var icon = forge == 'yes' ? '<span class="text-success"><i class="icon-ok"></i> Forge Compatible</span>' : forge == 'no' ? '<span class="text-error"><i class="icon-remove"></i> Not Forge Compatible</span>' :
        '<span class="text-warning"><i class="icon-lock"></i> Forge Required</span>';

    return new Handlebars.SafeString(icon)
});

Handlebars.registerHelper('time_since', function(date) {
    return moment(date).fromNow();
});

Handlebars.registerHelper('cssify', function(str) {
    return str.replace(/[^a-z\d]/g, '');
});

Template.modRow.isOwner = function() {
    return this.owner === Meteor.userId();
};


Template.pagination.totalPages = function() {
    return Math.ceil(Session.get('totalRecords')/Session.get('pagingLimit'));
};

Template.pagination.hasMultiplePages = function() {
    return Session.get('totalRecords')/Session.get('pagingLimit') > 1;
};

Template.pagination.checkActive = function(n) {
    var currentPage = Math.ceil(Session.get('pagingSkip')/Session.get('pagingLimit'));

    return n == currentPage? 'active': '';
};

Template.pagination.checkFirst = function() {
    var currentPage = Math.ceil(Session.get('pagingSkip')/Session.get('pagingLimit'));

    return currentPage == 0? 'disabled': '';
};

Template.pagination.checkLast = function() {
    var currentPage = Math.ceil(Session.get('pagingSkip')/Session.get('pagingLimit'));
    var maxPage = Math.ceil(Session.get('totalRecords')/Session.get('pagingLimit')) - 1;

    return currentPage == maxPage? 'disabled': '';
};

Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

Handlebars.registerHelper('plusOne', function(n) {
    return n + 1;
});

Template.pagination.events({
    'click .pageButton': function(event, template) {
        var page = Math.ceil(Session.get('pagingSkip')/Session.get('pagingLimit'));
        var target = $(event.target).data('page');

        switch (target) {
            case 'next':
                page++;
                break;
            case 'back':
                page--;
                break;
            default:
                page = target || 0; //zero if pagination is missing
                break;
        }
        var newSkip = Math.max(0, page * Session.get('pagingLimit'));

        Session.set('pagingSkip', newSkip);
    }
});
/*
TODO:
Select2 blocks events from propagating which leads to all kinds of garbge. 
I'll need to look into this in order to style the dropdowns properly

Template.mods.created = function() {
    Template.mods.whenReady = new $.Deferred()
    .done(function(){
        $('#inputForge').on('change', filterQuery);
        $('#inputAvailability').on('change', filterQuery);
    });
}

Template.mods.rendered = function() {
    Template.mods.whenReady.resolve();
    safelySelect2();
}

function safelySelect2() {
    if(!$('#inputForge').hasClass('initialised')){
        $('#inputForge').addClass('initialised')
        .select2({
            //we include bootstrap icons in the options
            escapeMarkup: function(m) { return m; }
        })
        $('#inputAvailability').select2(); 
    }
};

function filterQuery() {
    var forge = $('#inputForge').val();
    var availability = $('#inputAvailability').val();

    console.log({
        forge: forge,
        availability: availability
    })
};
*/
