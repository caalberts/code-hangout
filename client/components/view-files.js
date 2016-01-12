Template.viewFiles.helpers({
  files: function () {
    return Files.find({ gistId: this.gistId })
  },
  disableEdit: function () {
    return !(this.ownerId === Meteor.userId())
  }
})
Template.viewFiles.events({
  'submit form': function (event) {
    event.preventDefault()
    const updateContent = {
      files: {}
    }
    updateContent.files[this.filename] = { content: event.target.fileContent.value }

    Meteor.call('updateGist', this.gistId, this.filename, updateContent)
  }
})
