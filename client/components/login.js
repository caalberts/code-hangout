Accounts.ui.config({
  requestPermissions: {
    github: ['user', 'repo', 'gist']
  }
})

Template.login.helpers({
  currentUser: function() {
    return Meteor.user()
  }
})

Template.login.events({
})
