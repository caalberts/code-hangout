/* global _ */

Template.editor.helpers({
  owner: function () {
    return (Meteor.userId() && (Meteor.userId() === Session.get('gistOwnerId')))
  },

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

      if (!Meteor.userId()) {
        cm.setOption('readOnly', true)
      } else {
        const collaboratorIds = Session.get('gistCollaborators').map(collaborator => collaborator.githubId)
        const collaboratorIndex = collaboratorIds.indexOf(Meteor.user().services.github.id)
        if ((collaboratorIndex < 0) && (Meteor.userId() !== Session.get('gistOwnerId'))) {
          cm.setOption('readOnly', true)
        }
      }

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
