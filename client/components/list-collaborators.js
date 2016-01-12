Template.listCollaborators.helpers({
  collaborators: function () {
    const gist = Gists.findOne({ gistId: this.gistId })
    return gist.collaborators
  }
})

Template.listCollaborators.events({
  'click .remove-collaborator': function () {
    Meteor.call('removeCollaborator', Session.get('gistId'), this.toString())
  }
})
