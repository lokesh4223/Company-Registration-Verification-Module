const ghpages = require('gh-pages');

ghpages.publish('dist', {
  branch: 'gh-pages',
  repo: 'https://github.com/lokesh4223/Company-Registration-Verification-Module.git',
  user: {
    name: 'lokesh4223',
    email: 'lokesh4223@example.com'
  }
}, function(err) {
  if (err) {
    console.log('Deployment failed:', err);
  } else {
    console.log('Deployment successful!');
  }
});