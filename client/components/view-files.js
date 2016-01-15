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
      ownerId: this.ownerId
    }
    Meteor.call('createFile', this.gistId, newFile, (err, result) => {
      if (err) console.err(err)
      const newFileId = Files.findOne(
        { $and: [
          { gistId: newFile.gistId },
          { filename: newFile.filename }
        ] }
      )
      Session.set('fileId', newFileId._id)
    })
  }
})

Template.fileItem.helpers({
  owner: function () {
    return Session.get('isOwner')
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
    // fallback to other files in the gist
    const fallbackFile = Files.findOne({ gistId: this.gistId })
    if (fallbackFile) Session.set('fileId', fallbackFile._id)
    else Session.set('fileId', null)
  }
})
