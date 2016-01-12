/* global Meteor, Template, Documents, EditingUsers $ */

Template.editor.helpers({
  filename:function(){
    var file = Files.findOne({ gistId: this.gistId })
    return file.filename
  },
  docid: function () {
    var file = Files.findOne({ gistId: this.gistId })
    if (file) {
      return file.gistId
    } else {
      return undefined
    }
  },
  config: function () {
    var file = Files.findOne({ gistId: this.gistId })
    var converter = new Showdown.converter();

    return function (editor) {
      editor.setOption("lineNumbers", true)
      editor.setOption("theme", "dracula")
      editor.setOption("value", file.content)

      // editor.on('focus', function (cm_editor, info) {
      //   editor.setOption("value", file.content)
      // })

      editor.on('change', function (cm_editor, info) {
        var cmValue = cm_editor.getValue()
        var cmMarkdown = converter.makeHtml(cmValue)
        // $('#viewer_iframe').contents().find('html').html(cm_editor.getValue())
        $('#viewer_iframe').contents().find('html').html(cmMarkdown)
        Meteor.call('addEditingUser')
        editor.refresh()
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
