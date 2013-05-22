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

Meteor.startup(function() {
    loadPicker('AI2InDdBERZ6M2VTDO4RGz');
});

Template.submit.showSuccessDialog = function() {
    return Session.get('showSuccessDialog');
};

Template.submit.events({
    'click #login-reveal': function() {
        setTimeout(function() {
            $('.dropdown-toggle').click();
        });
    },
    'click #inputFile': function(e) {
        filepicker.pickAndStore({
            services: ['COMPUTER']
        }, {
            location: 'S3',
            access: 'public'
        },

        function(files) {
            var url = 'https://s3.amazonaws.com/modlist/' + files[0].key;

            $('#inputDownload').val(url)
                .prop('disabled', true)
                .closest('.control-group').addClass('success');
        });

        function trimExtension(str) {
            return str.substr(0, str.lastIndexOf('.'));
        }
        e.preventDefault();
    },
    'click #inputImage': function(e) {
        filepicker.pickAndStore({
            mimetype: 'image/*',
            services: ['COMPUTER']
        }, {
            location: 'S3',
            access: 'public'
        },

        function(fpfiles) {
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
            if (!Session.get('focusImage')) Session.set('focusImage', images[0]);
        });

        function trimExtension(str) {
            return str.substr(0, str.lastIndexOf('.'));
        }
        e.preventDefault();
    },
    'click #submit-mod': function(event, template) {
        event.preventDefault();
        var isInvalid = $(':invalid').length > 0;

        if(isInvalid) {
            $(':invalid').closest('.control-group').addClass('error');
            return false;
        }
        var title = template.find('[name="title"]').value;
        var version = template.find('[name="version"]').value;
        var url = template.find('[name="download"]').value;
        var supports = template.find('[name="supports"]').value;

        var data = {
            title: title,
            version: version,
            author: template.find('[name="author"]').value,
            description: $('#editor').val(),
            supports: supports,
            forge: $(template.find('[name="forge"]')).val(),
            availability: $(template.find('[name="availability"]')).val(),
            images: Session.get('submitImages'),
            featureImage: Session.get('focusImage'),
            download: [{
                title: title,
                version: version,
                gameVersion: supports,
                url: url,
                added: (new Date()).getTime()
            }]
        };

        Meteor.call('createMod', data, function(error, mod) {
            if (!error) {
                Session.set('showSuccessDialog', true);
            }
        });
    },
    'change :required': function(event) {
        var isInvalid = $(event.target).is(':invalid');

        $(event.target).closest('.control-group')[isInvalid? 'addClass': 'removeClass']('error');
    },
    'change #editor': function() {
        
    }
});

Template.submit.rendered = function() {
    $('#inputSupports').select2();
    $('#inputForge').select2({
        //we include bootstrap icons in the options
        escapeMarkup: function(m) {
            return m;
        }
    });
    $('#inputAvailability').select2();

    $('#editor').markdownEditor({
        toolbarLoc: $('#toolbar'),
        toolbar: 'default',
        preview: $('#preview')
    });
    $('#editor').autogrow();
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
