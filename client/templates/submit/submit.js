Session.set('showSuccessDialog', false);
Session.set('focusImage', null);
Session.set('submitImages', []);
/*Session.set('submitImages', [
    {url: 'http://lorempixel.com/output/people-q-c-640-480-3.jpg'},
    {url: 'http://lorempixel.com/output/people-q-c-640-480-7.jpg'},
    {url: 'http://lorempixel.com/output/people-q-c-640-480-3.jpg'},
    {url: 'http://lorempixel.com/output/people-q-c-640-480-7.jpg'},
    {url: 'http://lorempixel.com/output/people-q-c-640-480-3.jpg'},
    {url: 'http://lorempixel.com/output/people-q-c-640-480-7.jpg'},
]);*/

Meteor.startup(function(){
    loadPicker('AI2InDdBERZ6M2VTDO4RGz');
});

Template.submit.showSuccessDialog = function() {
    return Session.get('showSuccessDialog');
};

Template.submit.events({
    'click #login-reveal': function() {
        setTimeout(function(){$('.dropdown-toggle').click();});
    },
    'click #inputImage': function(e) {
        filepicker.pickAndStore({mimetype:'image/*'},
            {location:'S3', access: 'public'}, function(fpfiles){
           var images = Session.get('submitImages');
            
            _.each(fpfiles, function(pic) {
                var name = trimExtension(pic.key);
                images.push({
                    name: name,
                    alt: name,
                    url: 'https://s3.amazonaws.com/modlist/' + pic.key
                });
            });
            Session.set('submitImages', images);
            if(!Session.get('focusImage')) Session.set('focusImage', images[0]);
        });
        function trimExtension(str) {
            return str.substr(0, str.lastIndexOf('.'));
        }
        e.preventDefault();
    },
    'click #submit-mod': function(event, template) {
        event.preventDefault();
        var title = template.find('[name="title"]').value;
        var version = template.find('[name="version"]').value;
        var author = template.find('[name="author"]').value;
        var description = $('#inputDescription').cleanHtml();
        var supports = template.find('[name="supports"]').value;
        var forge = $(template.find('[name="forge"]')).val();
        var availability = $(template.find('[name="availability"]')).val();
        var images = Session.get('submitImages');
        var featureImage = Session.get('focusImage');

        event.preventDefault();

        if (title.length && description.length) {
            Meteor.call('createMod', {
                title: title,
                version: version,
                author: author,
                description: description,
                supports: supports,
                forge: forge,
                availability: availability,
                images: images,
                featureImage: featureImage
            }, function(error, mod) {
                if (!error) {
                    Session.set('showSuccessDialog', true);
                }
            });
        } else {
            //Session.set('createError', 'It needs a title and a description, or why bother?');
        }
    }
});

Template.submit.rendered = function() {
    $('#inputSupports').select2();
    $('#inputForge').select2({
        //we include bootstrap icons in the options
        escapeMarkup: function(m) { return m; }
    });
    $('#inputAvailability').select2();
    if(!$('#inputDescription').attr('contenteditable')) $('#inputDescription').wysiwyg();
}

Template.submitGallery.images = function() {
    return Session.get('submitImages');
};

Template.submitGallery.focusImage = function() {
    return Session.get('focusImage');
};

Template.submitGallery.events({
    'click .thumb-link': function(event) {
        var index = $(event.target).closest('a').index();

        Session.set('focusImage', Session.get('submitImages')[index]);
        event.preventDefault();
    }
});

Template.successDialog.events({
    'click .save': function() {
        Session.set('showSuccessDialog', false);
    }
});
