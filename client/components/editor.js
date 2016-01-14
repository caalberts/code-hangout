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

  editors: function () {
    const edits = Edits.find({ fileId: Session.get('fileId')})
    if (edits) {
      return edits.map(edit => edit.username)
    }
  },

  manyEditors: function () {
    const edits = Edits.find({ fileId: Session.get('fileId')})
    return edits.length > 1
  },

  config: function () {
    return function (cm) {
      const file = Files.findOne({ _id: Session.get('fileId') })

      cm.setOption('lineNumbers', true)

      if (!Meteor.userId()) {
        cm.setOption('readOnly', true)
      } else {
        const collaborators = Session.get('gistCollaborators')
        if (collaborators) {
          const collaboratorIds = collaborators.map(collaborator => collaborator.githubId)
          const collaboratorIndex = collaboratorIds.indexOf(Meteor.user().services.github.id)
          if ((collaboratorIndex < 0) && (Meteor.userId() !== Session.get('gistOwnerId'))) {
            cm.setOption('readOnly', true)
          }
        }
      }

      // cm.setValue(file.content)

      cm.on('keydown', _.debounce(function (editor) {
        Meteor.call('setEditLocation', Meteor.userId(), file._id, editor.doc.getCursor())
        _.delay(function() {
          Meteor.call('removeEditLocation', Meteor.userId(), file._id)
        }, 3000)
      }), 1000)

      // periodically update file object when there is a change in the editor
      cm.on('change', _.debounce(function (editor) {
        Meteor.call('updateFile', file._id, editor.getValue())
      }, 2000))

      // log activities in edits
    }
  },
  setContent: function () {
    return function (cm) {
      // console.log('set content');
      const file = Files.findOne({ _id: Session.get('fileId') })
      cm.setValue(file.content)
    }
  }
})

Template.editor.events({
  'focus .file-name': function (event) {
    Session.set('prevFileName', event.target.textContent)
  },
  'blur .file-name': function (event) {
    if (event.target.textContent !== Session.get('prevFileName')) {
      // TODO follow up with Github support on 500 error
      // Meteor.call('renameFile', this.gistId, Session.get('fileId'), Session.get('prevFileName'), event.target.textContent)
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
