Template.listGists.helpers({
  gists: function () {
    return Gists.find({ ownerId: Meteor.userId() })
  },
  collaborations: function () {
    return Gists.find({
      collaborators: {
        $in: [{
          githubId: Meteor.user().services.github.id,
          githubLogin: Meteor.user().services.github.username
        }]
      }
    })
  }
})

Template.listGists.events({
  'click .createGist': function (event) {
    const createGist = {
      description: 'Untitled',
      public: true,
      files: {
        'untitled': {
          content: 'new content'
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
