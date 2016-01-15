Accounts.ui.config({
  requestPermissions: {
    github: ['user', 'public_gist']
  }
})
//
// Accounts.onLogin(function () {
//   Router.go('/profile')
// })

Template.login.helpers({
  currentUser: function () {
    return Meteor.user()
  }
})

Template.login.events({
})
