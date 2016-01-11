Template.listGists.helpers({
  gists: function () {
    return Documents.find({ owner: Meteor.userId() })
  }
})

Template.listGists.events({

})
