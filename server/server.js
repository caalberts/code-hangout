const fetch = Meteor.npmRequire('node-fetch')

// retrieve list of user's gists upon Login
Accounts.onLogin(function () {
  const url = 'https://api.github.com/users/' + Meteor.user().services.github.username + '/gists'
  const header = {
    headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken }
  }
  fetch(url, header)
    .then(res => res.json())
    .then(gists => {
      let userGists = []
      gists.forEach(gist => {
        Meteor.call('retrieveGistFiles', gist.id)
        userGists.push(gist.id)
      })
      Meteor.users.update(
        { _id: Meteor.userId() },
        { $set: { gists: userGists } }
      )
    })
})

Meteor.methods({
  retrieveGistFiles: function (id) {
    // retrieve each gist
    const url = 'https://api.github.com/gists/' + id
    const opts = {
      headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken }
    }
    return fetch(url, opts)
      .then(res => res.json())
      .then(gist => {
        const filenames = Object.keys(gist.files)
        const newGist = {
          gistId: gist.id,
          url: gist.url,
          description: gist.description,
          owner: gist.owner,
          ownerId: Meteor.userId(),
          files: filenames,
          created_at: gist.created_at,
          updated_at: gist.updated_at
        }
        const oldGist = Gists.findOne({ gistId: gist.id })
        const updatedGist = oldGist ? Object.assign({}, oldGist, newGist) : newGist
        Gists.upsert({ gistId: gist.id }, updatedGist)

        // update each file from origin into local
        filenames.forEach(file => {
          const fileObj = Object.assign(
            {}, gist.files[file],
            {
              gistId: id,
              ownerId: Meteor.userId()
            })
          Files.upsert({
            $and: [{ filename: file }, { gistId: id }]
          }, fileObj)
        })
        return gist.id
      })
  },

  updateGist: function (gistId, filename, updateContent) {
    const url = 'https://api.github.com/gists/' + gistId
    const opts = {
      method: 'PATCH',
      headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken },
      body: JSON.stringify(updateContent)
    }
    Files.update(
      { filename: filename },
      { $set: { content: updateContent.files[filename].content } }
    )
    fetch(url, opts).catch(console.error)
  },

  updateFile: function (fileId, newContent) {
    Files.update(
      { _id: fileId },
      { $set: { content: newContent } }
    )
  },

  publishGist: function (gistId, fileIds) { // TODO will replace updateGist()
    const updateContent = {
      files: {}
    }

    // consolidate files
    Files.find({ gistId: gistId })
      .forEach(file => {
        updateContent.files[file.filename] = { content: file.content }
      })

    // send update to github
    const url = 'https://api.github.com/gists/' + gistId
    const opts = {
      method: 'PATCH',
      headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken },
      body: JSON.stringify(updateContent)
    }
    fetch(url, opts).catch(console.error)

    // synchronize with github
    Meteor.call('retrieveGistFiles', gistId)
  },

  addCollaborator: function (gistId, username) {
    Gists.update(
      { gistId: gistId },
      { $addToSet: { collaborators: username } }
    )
  },

  removeCollaborator: function (gistId, username) {
    Gists.update(
      { gistId: gistId },
      { $pull: { collaborators: username } }
    )
  },

  // addEditingUser: function () {
  //   var doc, user, eusers
  //   doc = Documents.findOne()
  //   if (!doc) {
  //     return
  //   }
  //   if (!this.userId) {
  //     return
  //   }
  //   user = Meteor.user().profile
  //   eusers = EditingUsers.findOne({ docid: doc._id })
  //   if (!eusers) {
  //     eusers = {
  //       docid: doc._id,
  //       users: {}
  //     }
  //   }
  //   user.lastEdit = new Date()
  //   eusers.users[this.userId] = user
  //
  //   EditingUsers.upsert({ _id: eusers._id }, eusers)
  // }
})
