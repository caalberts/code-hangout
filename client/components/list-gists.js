Meteor.subscribe('user')
Meteor.subscribe('gists')

Template.listGists.helpers({
  gists: function () {
    return Gists.find({ ownerId: Meteor.userId() })
  }
})

Template.listGists.events({

})
