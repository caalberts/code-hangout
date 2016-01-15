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
          public: gist.public,
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
        Meteor.call('addCollaborator', gist.id, gist.owner.login, gist.owner.id)
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

  createGist: function () { // TODO move createGist from client to server

  },

  renameGist: function (gistId, newDescription) {
    const updateContent = {
      description: newDescription
    }
    const url = 'https://api.github.com/gists/' + gistId
    const opts = {
      method: 'PATCH',
      headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken },
      body: JSON.stringify(updateContent)
    }
    fetch(url, opts)
      .then(res => {
        if (res.status === 200) {
          Gists.update({ gistId: gistId }, { $set: { description: newDescription } })
        } else {
          throw new Error(res.status)
        }
      })
      .catch(console.error)
  },

  publishGist: function (gistId, fileIds) {
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

  deleteGist: function (gistId) { // TODO add feature to delete gist
    const gistOwnerId = Gists.findOne({ gistId: gistId }).ownerId
    if (Meteor.userId() === gistOwnerId) {
      const url = 'https://api.github.com/gists/' + gistId
      const opts = {
        method: 'DELETE',
        headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken }
      }
      fetch(url, opts).then(res => {
        // add check if delete was successful
        if (res.status === 204) {
          // remove local gists and files
          Gists.remove({ gistId: gistId })
          Files.remove({ gistId: gistId })
          // remove gistId from user profile
          Meteor.users.update(
            { _id: Meteor.userId() },
            { $pull: { gists: gistId } }
          )
        }
      }).catch(console.error)
    } else {
      return
    }
  },

  createFile: function (gistId, newFile) {
    const url = 'https://api.github.com/gists/' + gistId
    const githubFile = {
      files: {}
    }
    githubFile.files[newFile.filename] = { content: newFile.content }
    const opts = {
      method: 'PATCH',
      headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken },
      body: JSON.stringify(githubFile)
    }
    return fetch(url, opts)
      .then(res => res.json())
      .then(data => {
        return Files.insert(newFile, function (err, id) {
          if (err) throw err
          Gists.update(
            { gistId: newFile.gistId },
            { $addToSet: { files: newFile.filename } }
          )
          return id
        })
      })
      .catch(console.error)
  },

  // renameFile: function (gistId, fileId, oldName, newName) {
  //   const updateContent = {
  //     files: {}
  //   }
  //   updateContent.files[oldName] = { filename: newName }
  //
  //   const url = 'https://api.github.com/gists/' + gistId
  //   const opts = {
  //     method: 'PATCH',
  //     headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken },
  //     body: JSON.stringify(updateContent)
  //   }
  //   // TODO follow up with Github support on 500 error
  //   fetch(url, opts)
  //     .then(res => {
  //       if (res.status === 200) {
  //         // rename local file
  //       } else {
  //         throw new Error(res.status)
  //       }
  //     })
  //     .catch(console.error)
  // },

  updateFile: function (fileId, newContent) {
    Files.update(
      { _id: fileId },
      { $set: { content: newContent } }
    )
  },

  deleteFile: function (gistId, fileId, filename) { // TODO add feature to delete file
    const deleteFile = {
      files: {}
    }
    deleteFile.files[filename] = null

    const url = 'https://api.github.com/gists/' + gistId
    const opts = {
      method: 'PATCH',
      headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken },
      body: JSON.stringify(deleteFile)
    }
    fetch(url, opts)
      .then(res => {
        if (res.status === 200) {
          Gists.update(
            { gistId: gistId },
            { $pull: { files: filename } }
          )
          Files.remove({ _id: fileId })
        } else {
          throw new Error(res.status)
        }
      })
      .catch(console.error)
  },

  addCollaborator: function (gistId, githubLogin, githubId) {
    const update = {
      collaborators: {
        githubId: githubId,
        githubLogin: githubLogin
      }
    }
    Gists.update(
      { gistId: gistId },
      { $addToSet: update }
    )
  },

  removeCollaborator: function (gistId, user) {
    Gists.update(
      { gistId: gistId },
      { $pull: { collaborators: user } }
    )
  },

  setEditLocation: function (userId, fileId, location) {
    Edits.upsert(
      { $and: [{ userId: userId }, { fileId: fileId }] },
      {
        fileId: fileId,
        userId: userId,
        username: Meteor.user().services.github.username,
        location: location
      }
    )
  },

  removeEditLocation: function (userId, fileId) {
    Edits.remove({ $and: [{ userId: userId }, { fileId: fileId }] })
  }
})
