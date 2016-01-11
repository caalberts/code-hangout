Meteor.subscribe('userData')

Template.listGists.onCreated(function () {
  const user = Meteor.user()
  console.log(user.docs)

  const header = {
    Authorization: 'token ' + Meteor.user().services.github.accessToken
  }

  Promise.all(user.docs.map(doc => {
    const url = 'https://api.github.com/gists/' + doc
    return fetch(url, header).then(res => res.json())
  })).then(data => Session.set('userGists', data))
    .catch(console.error)
})

Template.listGists.helpers({
  gists: function () {
    console.log('hello');
    const myGists = Session.get('userGists')
    return myGists
  }
})

Template.listGists.events({

})
