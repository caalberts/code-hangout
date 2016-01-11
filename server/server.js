const fetch = Meteor.npmRequire('node-fetch')

// retrieve list of gists upon Login
Accounts.onLogin(function () {
  const url = 'https://api.github.com/users/' + Meteor.user().services.github.username + '/gists'
  const header = {
    Authorization: 'token ' + Meteor.user().services.github.accessToken
  }
  fetch(url, header)
    .then(res => res.json())
    .then(docs => {
      let userDocs = []
      docs.forEach(doc => userDocs.push(doc.id))
      Meteor.users.update(
        { _id: Meteor.userId() },
        { $set: { docs: userDocs } }
      )
      userDocs.forEach(doc => Meteor.call('createDocument', doc))
    })
})

Meteor.publish('userData', function(){
  if (this.userId) {
    const user = Meteor.users.find(this.userId)
    return user
  }
})

Meteor.methods({
  createDocument: function (docId) {
    const url = 'https://api.github.com/gists/' + docId
    const opts = {
      headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken }
    }
    console.log('fetching ', url, opts)
    return fetch(url, opts)
    .then(res => res.json())
    .then(data => {
      console.log('received data')
      const obj = {
        _id: docId,
        owner: Meteor.userId(),
        content: JSON.stringify(data)
      }
      Documents.upsert({ _id: docId }, obj)
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
