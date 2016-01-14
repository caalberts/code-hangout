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
  'keyup .search-user': _.debounce(function (event) {
    searchGithubUsers(event.target.value)
  }, 500),
  // add github user to form
  'click .search-result': function (event) {
    document.querySelector('.search-user').value = event.target.textContent
    Session.set('searchUsers', null)
  },
  // add collaborator to the gist
  'submit form': function (event) {
    event.preventDefault()
    Meteor.call('addCollaborator', this.gistId, event.target.searchUsers.value)
    event.target.searchUsers.value = ''
  }
})

function searchGithubUsers (string) {
  const url = 'https://api.github.com/search/users?q=' + string + '+in:login'
  window.fetch(url)
    .then(res => res.json())
    .then(data => Session.set('searchUsers', data.items.map(item => item.login)))
}
