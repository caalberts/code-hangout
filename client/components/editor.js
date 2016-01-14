/* global _ */

Template.editor.events({
  'click #preview': function (event) {
    return false
  }
})

Template.editor.helpers({
  fileId: function () {
    return Session.get('fileId')
  },
  filename: function () {
    return Files.findOne({ _id: Session.get('fileId') }).filename
  },
  config: function () {
    return function (cm) {
      var converter = new Showdown.converter();
      const file = Files.findOne({ _id: Session.get('fileId') })

      cm.setSize('100%', 400)
      cm.setOption('lineNumbers', true)
      cm.setOption('lineWrapping', true)

      // periodically update file object when there is a change in the editor
      cm.doc.on('change', _.debounce(function (editor) {
        document.getElementById('preview').innerHTML = converter.makeHtml(editor.getValue())
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
