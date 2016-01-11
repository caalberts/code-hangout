Accounts.ui.config({
  requestPermissions: {
    github: ['user', 'repo', 'gist']
  }
})

// retrieve list of gists upon Login
Accounts.onLogin(function () {
  // Meteor.subscribe('userData')
  // const url = 'https://api.github.com/users/' + Meteor.user().services.github.username + '/gists'
  // const header = {
  //   Authorization: 'token ' + Meteor.user().services.github.accessToken
  // }
  // console.log('fetching list of gists belonging to user and store in db');
  // fetch(url, header)
  //   .then(res => res.json())
  //   .then(docs => {
  //     let userDocs = []
  //     docs.forEach(doc => {
  //       console.log(doc)
  //       userDocs.push(doc.id)
  //       // Documents.insert(doc)
  //     })
  //     Meteor.users.update(
  //       { _id: Meteor.userId() },
  //       { $set: { docs: userDocs } }
  //     )
  //     // user['docs'] = userDocs
  //     // Session.set('userGists', data)
  //   })
})

Template.login.helpers({
  currentUser: function() {
    return Meteor.user()
  }
})

Template.login.events({
})
