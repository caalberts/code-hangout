/* global _ */

Template.actions.helpers({
  results: function () {
    return Session.get('searchUsers')
  }
})

Template.actions.events({
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
