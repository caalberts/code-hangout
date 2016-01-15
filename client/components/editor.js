/* global _ */

Template.editor.events({
  'click #preview': function (event) {
    return false
  },
  "mouseover .file-name": function(event, template) {
    $('[data-toggle="tooltip"]').tooltip()
  }
})

Template.editor.helpers({
  owner: function () {
    return Session.get('isOwner')
  },
  fileId: function () {
    return Session.get('fileId')
  },

  filename: function () {
    return Files.findOne({ _id: Session.get('fileId') }).filename
  },

  editors: function () {
    const editors = Edits.find({ fileId: Session.get('fileId') })
    if (editors) {
      const usernames = editors.map(editor => editor.username)
      if (Meteor.userId()) {
        return usernames.filter(username => username !== Meteor.user().services.github.username).join(', ')
      } else {
        return usernames.join(', ')
      }
    }
  },

  manyEditors: function () {
    const list = Edits.find({ fileId: Session.get('fileId') })
                      .map(editor => editor.username)
    if (Meteor.userId()) return list.length > 2
    else return list.length > 1
  },

  config: function () {
    return function (cm) {
      var converter = new Showdown.converter();
      const file = Files.findOne({ _id: Session.get('fileId') })

      cm.setSize('100%', 400)
      cm.setOption('lineNumbers', true)
      cm.setOption('lineWrapping', true)

      if (!Meteor.userId() || !Session.get('allowEdit')) {
        cm.setOption('readOnly', true)
      }

      // broadcast editors' editing activities
      if (Session.get('allowEdit')) {
        cm.on('keydown', _.debounce(function (editor) {
          Meteor.call('setEditLocation', Meteor.userId(), file._id, editor.doc.getCursor())
          _.delay(function () {
            Meteor.call('removeEditLocation', Meteor.userId(), file._id)
          }, 3000)
        }), 1000)
      }

      // if (!Meteor.userId()) {
      //   cm.setOption('readOnly', true)
      // } else {
      //   const collaborators = Session.get('gistCollaborators')
      //   if (collaborators) {
      //     const collaboratorIds = collaborators.map(collaborator => collaborator.githubId)
      //     const collaboratorIndex = collaboratorIds.indexOf(Meteor.user().services.github.id)
      //     if ((collaboratorIndex < 0) && (Meteor.userId() !== Session.get('gistOwnerId'))) {
      //       cm.setOption('readOnly', true)
      //     }
      //   }
      // }

      // periodically update file object when there is a change in the editor
      cm.on('change', _.debounce(function (editor) {
        document.getElementById('preview').innerHTML = converter.makeHtml(editor.getValue())
        Meteor.call('updateFile', file._id, editor.getValue())
      }, 2000))
    }
  },
  setContent: function () {
    return function (cm) {
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
