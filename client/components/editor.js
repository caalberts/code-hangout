/* global _ */

Template.editor.helpers({
  fileId: function () {
    return Session.get('fileId')
  },
  filename: function () {
    return Files.findOne({ _id: Session.get('fileId') }).filename
  },
  config: function () {
    return function (cm) {
      const file = Files.findOne({ _id: Session.get('fileId') })

      cm.setOption('lineNumbers', true)

      // set content of the editor to the latest content from file object
      cm.doc.setValue(file.content)

      // periodically update file object when there is a change in the editor
      cm.doc.on('change', _.debounce(function (editor) {
        Meteor.call('updateFile', file._id, editor.getValue())
      }, 500))
    }
  },
  setContent: function () {
    return function (cm) {
      const file = Files.findOne({ _id: Session.get('fileId') })
      cm.doc.setValue(file.content)
    }
  }
})
//
// Template.editingUsers.helpers({
//   users: function () {
//     var doc, eusers, users
//     doc = Documents.findOne()
//     if (!doc) {
//       return
//     }
//     eusers = EditingUsers.findOne()
//     if (!eusers) {
//       return
//     }
//
//     users = []
//     var i = 0
//     for (var user_id in eusers.users) {
//       users[i] = eusers.users[user_id]
//       i++
//     }
//     return users
//   }
// })
