Template.viewFiles.helpers({
  files: function () {
    console.dir('helper this', this.gistId)
    return Files.find({ gistId: this.gistId })
  },
  disableEdit: function () {
    return !(this.ownerId === Meteor.userId())
  }
})
Template.viewFiles.events({
  'submit form': function(event) {
    event.preventDefault()

    console.log(event.target.fileContent.value)
    console.log(this.filename)
    console.log(this.gistId)
    const updateContent = {
      files: {}
    }
    updateContent.files[this.filename] = { content: event.target.fileContent.value }

    Meteor.call('updateGist', this.gistId, this.filename, updateContent)
  }
})
