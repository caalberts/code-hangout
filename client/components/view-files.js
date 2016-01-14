Template.fileList.onCreated(function () {
  const file = Files.findOne({ gistId: Session.get('gistId') })
  if (file) Session.set('fileId', file._id)
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
    event.preventDefault()
    // load content in editor
    Session.set('fileId', this._id)
  },
  'click a.delete-file': function (event) {
    event.preventDefault()
    console.log(this)
    Meteor.call('deleteFile', this.gistId, this._id, this.filename)
    Session.set('fileId', null)
  }
})
