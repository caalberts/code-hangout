Template.collaborators.helpers({
  collaborators: function () {
    const gist = Gists.findOne({ gistId: this.gistId })
    return gist.collaborators
  },
  owner: function () {
    return (Meteor.userId() && (Meteor.userId() === Session.get('gistOwnerId')))
  }
})

Template.collaborators.events({
  'click .remove-collaborator': function () {
    Meteor.call('removeCollaborator', Session.get('gistId'), this)
  }
})
