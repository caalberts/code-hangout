Meteor.subscribe('files')

Template.fileList.onCreated(function () {
  const file = Files.findOne({ gistId: Session.get('gistId') })
  Session.set('fileId', file._id)
})

Template.fileList.helpers({
  files: function () {
    return Files.find({ gistId: this.gistId })
  },
  disableEdit: function () {
    return !(this.ownerId === Meteor.userId())
  }
})

Template.fileList.events({
  'submit form': function (event) {
    event.preventDefault()
    const updateContent = {
      files: {}
    }
    updateContent.files[this.filename] = { content: event.target.fileContent.value }

    Meteor.call('updateGist', this.gistId, this.filename, updateContent)
  }
})

Template.fileItem.events({
  'click a.file': function (event) {
    // load content in editor
    Session.set('fileId', this._id)
  }
})
