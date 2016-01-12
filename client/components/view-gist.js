Meteor.subscribe('user')
Meteor.subscribe('files')

Template.viewGist.onCreated(function () {
  Session.set('gistId', this.data.gistId)
})
