Router.configure({
  layoutTemplate: 'main',
  waitOn: function () {
    return [
      Meteor.subscribe('user'),
      Meteor.subscribe('gists'),
      Meteor.subscribe('files')
    ]
  }
})

Router.route('/', {
  template: 'home'
})

Router.route('/profile', {
  template: 'listGists'
})

// Router.route('/profile', function () {
//   this.render('listGists')
// }, {
//   name: 'profile'
// })

Router.route('/gist/:gistId', {
  template: 'viewGist',
  data: function () {
    Session.set('gistId', this.params.gistId)
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
