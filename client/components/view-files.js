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
  },
  'click .create-file': function (event) {
    event.preventDefault()

    const newFile = {
      filename: 'new-file-from-menu.txt',
      content: 'I clicked a button to create a file',
      gistId: this.gistId,
      ownerId: Meteor.userId()
    }
    Meteor.call('createFile', newFile)

    const newFileId = Files.findOne(
      { $and: [
        { gistId: newFile.gistId },
        { filename: newFile.filename }
      ] }
    )._id
    Session.set('fileId', newFileId)
  }
})

Template.fileItem.events({
  'click a.file': function (event) {
    // load content in editor
    Session.set('fileId', this._id)
  }
})
