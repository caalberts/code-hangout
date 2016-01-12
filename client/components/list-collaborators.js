Template.listCollaborators.helpers({
  collaborators: function () {
    console.log(this.gistId)
    const gist = Gists.findOne({ gistId: this.gistId })
    return gist.collaborators
  }
})
