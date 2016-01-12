Template.listCollaborators.helpers({
  collaborators: function () {
    const gist = Gists.find({ gistId: this.gistId })
    return gist.collaborators
  }
})
