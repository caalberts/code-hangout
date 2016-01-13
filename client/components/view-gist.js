Meteor.subscribe('user')
Meteor.subscribe('files')

Template.viewGist.onCreated(function () {
  if (Meteor.user()) {
    Session.set('gistId', this.data.gistId)
  }
})
