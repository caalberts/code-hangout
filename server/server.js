const fetch = Meteor.npmRequire('node-fetch')

// retrieve list of user's gists upon Login
Accounts.onLogin(function () {
  const url = 'https://api.github.com/users/' + Meteor.user().services.github.username + '/gists'
  const header = {
    Authorization: 'token ' + Meteor.user().services.github.accessToken
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

Meteor.publish('userData', function(){
  if (this.userId) {
    const user = Meteor.users.find(this.userId)
    return user
  }
})

Meteor.methods({
  retrieveGistFiles: function (gistId) {
    // retrieve each gist
    const url = 'https://api.github.com/gists/' + gistId
    const opts = {
      headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken }
    }
    console.log('fetching ', url, opts)
    fetch(url, opts)
      .then(res => res.json())
      .then(gist => {
        console.log('received gist')
        const obj = {
          id: gist.id,
          url: gist.url,
          owner: gist.owner,
          ownerId: Meteor.userId(),
          files: Object.keys(gist.files),
          created_at: gist.created_at,
          updated_at: gist.updated_at
        }
        // save each gist into db
        Gists.upsert({ id: gistId }, obj)
        // save each file into db
        Object.keys(gist.files).forEach(file => {
          const fileObj = Object.assign(gist.files[file], { gistId: gistId })
          console.log(fileObj)
          Files.upsert({ filename: file }, fileObj)
        })
      })
  },
  addEditingUser: function(){
    var doc, user, eusers
    doc = Documents.findOne()
    if (!doc){
      return
    }
    if (!this.userId){
      return
    }
    user = Meteor.user().profile
    eusers = EditingUsers.findOne({docid:doc._id})
    if (!eusers) {
      eusers = {
        docid: doc._id,
        users: {}
      }
    }
    user.lastEdit = new Date()
    eusers.users[this.userId] = user

    EditingUsers.upsert({_id:eusers._id}, eusers)
  }
})
