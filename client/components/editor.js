Template.editor.helpers({
  docid: function () {
    var doc = Documents.findOne()
    if (doc) {
      return doc._id
    } else {
      return undefined
    }
  },
  config: function () {
    return function (editor) {
      // console.log(editor)
      editor.on('change', function (cm_editor, info) {
        // console.log(cm_editor.getValue())
        $('#viewer_iframe').contents().find('html').html(cm_editor.getValue())
        Meteor.call('addEditingUser')
      })
    }
  }
})

Template.editingUsers.helpers({
  users: function () {
    var doc, eusers, users
    doc = Documents.findOne()
    if (!doc) {
      return
    }
    eusers = EditingUsers.findOne()
    if (!eusers) {
      return
    }

    users = []
    var i = 0
    for (var user_id in eusers.users) {
      users[i] = eusers.users[user_id]
      i++
    }
    return users
  }
})
