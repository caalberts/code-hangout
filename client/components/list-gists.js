/* global Meteor, Template, Gists */

Template.listGists.helpers({
  gists: function () {
    return Gists.find({ ownerId: Meteor.userId() })
  }
})

Template.listGists.events({

})
