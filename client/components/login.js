Accounts.ui.config({
  requestPermissions: {
    github: ['user', 'gist']
  }
})

Template.login.helpers({
  currentUser: function () {
    return Meteor.user()
  }
})

Template.login.events({
})
