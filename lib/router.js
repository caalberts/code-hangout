Router.configure({
  layoutTemplate: 'main',
  waitOn: function () {
    return [
      Meteor.subscribe('user'),
      Meteor.subscribe('gists'),
      Meteor.subscribe('files'),
      Meteor.subscribe('edits')
    ]
  }
})

Router.route('/', {
  template: 'home'
})

Router.route('/profile', {
  template: 'listGists'
})

Router.route('/gist/:gistId', {
  template: 'viewGist',
  data: function () {
    Session.set('gistId', this.params.gistId)
    return Gists.findOne({ gistId: this.params.gistId })
  }
})

Accounts.onLogin(function () {
  if (Meteor.isClient) {
    if (Router.current().route.path() !== '/profile') Router.go('/profile')
  }
})
