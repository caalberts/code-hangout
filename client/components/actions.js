/* global _ */

Template.actions.helpers({
  results: function () {
    return Session.get('searchUsers')
  }
})

Template.actions.events({
  // publish gist
  'click .publish-gist': function (argument) {
    Meteor.call('publishGist', this.gistId)
  },
  // delete gist
  'click .delete-gist': function () {
    Meteor.call('deleteGist', this.gistId, function (err, result) {
      if (err) console.error(err)
      Router.go('/profile')
    })
  },

  // search github users
  'keyup .search-githublogin': _.debounce(function (event) {
    searchGithubUsers(event.target.value)
  }, 300),
  // add github user to form
  'click .search-result': function (event) {
    Meteor.call(
      'addCollaborator',
      Session.get('gistId'),
      event.target.textContent,
      parseInt(event.target.getAttribute('data-github-id'), 10)
    )
    Session.set('searchUsers', null)
  }
  // add collaborator to the gist
  // 'submit form': function (event) {
  //   event.preventDefault()
  //
  //   document.querySelector('.search-githublogin').value = ''
  //   document.querySelector('.search-githubid').value = ''
  // }
})

function searchGithubUsers (string) {
  const url = 'https://api.github.com/search/users?q=' + string + '+in:login'
  window.fetch(url)
    .then(res => res.json())
    .then(data => {
      Session.set(
        'searchUsers',
        data.items.map(user => {
          return {
            githubLogin: user.login,
            githubId: user.id
          }
        })
      )
    })
}
