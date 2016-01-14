Template.fileList.onCreated(function () {
  const file = Files.findOne({ gistId: Session.get('gistId') })
  if (file) Session.set('fileId', file._id)
})

Template.fileList.helpers({
  files: function () {
    return Files.find({ gistId: this.gistId })
  }
})

Template.fileList.events({
  'click .create-file': function (event) {
    event.preventDefault()

    const newFile = {
      filename: 'untitled',
      content: 'new content',
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

Template.fileItem.helpers({
  owner: function () {
    return (Meteor.userId() && (Meteor.userId() === Session.get('gistOwnerId')))
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
    Meteor.call('deleteFile', this.gistId, this._id, this.filename)
    Session.set('fileId', null)
  }
})
