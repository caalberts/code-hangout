Template.listGists.helpers({
  gists: function () {
    return Gists.find({ ownerId: Meteor.userId() })
  }
})

Template.listGists.events({
  'click .createGist': function (event) {
    const createGist = {
      description: 'New gist',
      public: true,
      files: {
        'hello-world.txt': {
          content: 'hello world from new file'
        }
      }
    }
    // publish new gist to github
    const url = 'https://api.github.com/gists'
    const opts = {
      method: 'POST',
      headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken },
      body: JSON.stringify(createGist)
    }
    // call Github API to create gist
    // and synchronize local gistId with gist id assigned by Github
    window.fetch(url, opts).then(res => res.json())
      .then(gist => {
        Meteor.call('retrieveGistFiles', gist.id, (err, id) => {
          if (err) console.error(err)
          Router.go('/gist/' + id)
        })
      })
  }
})
