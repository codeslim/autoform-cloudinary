Package.describe({
  name: 'codeslim:autoform-cloudinary',
  git: 'https://github.com/codeslim/autoform-cloudinary.git',
  summary: 'Use Cloudinary with autoform/simpleschema to upload an image, and save the url on the collection.',
  version: '0.0.1'
});

Package.onUse(function (api) {
  Npm.depends({
    cloudinary: '1.2.1'
  });
  
  api.versionsFrom('1.1.0.2');

  api.use([
    'templating',
    'reactive-var',
    'underscore',
    'nekojira:cloudinary-jquery-upload@0.1.0',
    'aldeed:autoform@5.3.0',
    'markoshust:owl-carousel-2@2.0.0-beta.3a'
  ], 'client');

  api.addFiles([
    'autoform-cloudinary.html',
    'autoform-cloudinary.css',
    'autoform-cloudinary.js'
  ], 'client');

  api.addFiles([
    'autoform-cloudinary-server.js'
  ], 'server');
});
