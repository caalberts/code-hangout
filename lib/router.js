Router.configure({
  layoutTemplate: 'main'
})

Router.route('/', {
  template: 'home'
})

// Router.route('/profile', {
//   template: 'listGists'
// })

Router.route('/profile', function () {
  this.render('listGists')
}, {
  name: 'profile'
})

Router.route('/gist/:gistId', {
  template: 'viewGist',
  data: function () {
    return Gists.findOne({ gistId: this.params.gistId })
  }
})

// var requireLogin = function() {
//   if (! Meteor.user()) {
//    this.render('home');
//  } else {
//    this.next();
//  }
// }
//
// Router.onBeforeAction(requireLogin, {except: ['home']})
