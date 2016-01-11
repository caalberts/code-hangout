const fetch = Meteor.npmRequire('node-fetch')

// retrieve list of gists upon Login
Accounts.onLogin(function () {
  const url = 'https://api.github.com/users/' + Meteor.user().services.github.username + '/gists'
  const header = {
    Authorization: 'token ' + Meteor.user().services.github.accessToken
  }
  // console.log('fetching list of gists belonging to user and store in db');
  fetch(url, header)
    .then(res => res.json())
    .then(docs => {
      let userDocs = []
      docs.forEach(doc => {
        // console.log(doc)
        userDocs.push(doc.id)
        // Documents.insert(doc)
      })
      Meteor.users.update(
        { _id: Meteor.userId() },
        { $set: { docs: userDocs } }
      )
    })
})

Meteor.publish('userData', function(){
  if (this.userId) {
    const user = Meteor.users.find(this.userId)
    return user
  }
})
