AutoForm.addInputType('cloudinary', {
  template: 'afCloudinary',

  valueOut: function() {
    return this.val();
  }
});

Meteor.startup(function() {
  Meteor.call('publicCredentials', function(err, res) {
    if (res) {
      $.cloudinary.config({
        cloud_name: res.cloudName,
        api_key: res.apiKey
      });
    } else {
      $.cloudinary.config({
        cloud_name: Meteor.settings.public.CLOUDINARY_CLOUD_NAME,
        api_key: Meteor.settings.public.CLOUDINARY_API_KEY
      });
    }
  });
});

var templates = ['afCloudinary', 'afCloudinary_bootstrap3'];

var imgs_array = [];

_.each(templates, function(tmpl) {
  Template[tmpl].onCreated(function() {
    var self = this;

    self.url = new ReactiveVar();

    Session.setDefault('urls_array', null);

    self.initialValueChecked = false;
    self.checkInitialValue = function() {
      Tracker.nonreactive(function() {
                //! self.initialValueChecked && ! self.url.get() && 
                if (self.data.value) {
                  console.log("Data: " + self.data);
                  console.log("Data value:" + self.data.value);
                    //self.url.set(self.data.value);
                    //self.initialValueChecked = true;
                  }
                });
    };
  });

  Template[tmpl].onRendered(function() {
        var self = this;

        self.$('.owl-carousel').owlCarousel({
          center: true
        });

        Meteor.call('afCloudinarySign', function(err, res) {
          if (err) {
            return console.log(err);
          }

          self.$('input[name=file]').cloudinary_fileupload({
            formData: res
          });
        });

        self.$('input[name=file]').on('fileuploaddone', function(e, data) {
            //self.url.set(data.result.secure_url);

            imgs_array.push(data.result.secure_url);

            Session.set('urls_array', imgs_array);

            console.log(Session.get('urls_array'));

            var item = "<div class='afCloudinary-thumbnail'><a href='" + data.result.secure_url + "' target='_blank'><img src='" + data.result.secure_url + "'></a><span><a href='#'' class='js-remove'><span class='glyphicon glyphicon-remove'></span></a></span></div>";
            var owl = $(".owl-carousel");
            owl.data('owl.carousel').add(item);
            owl.data('owl.carousel').refresh();

            Tracker.flush();
          });

        self.$(self.firstNode).closest('form').on('reset', function() {
          Session.set('urls_array', null);
        });
      });


  Template[tmpl].helpers({
    url: function() {
      return Session.get('urls_array');
    },

    accept: function() {
      return this.atts.accept || 'image/*';
    }
  });

  Template[tmpl].events({
    'click button': function(e, t) {
      e.preventDefault();
      t.$('input[name=file]').click();
    },

    'click .js-remove': function(e, t) {
      e.preventDefault();
      console.log(e);
      t.url.set(null);
    }
  });
});