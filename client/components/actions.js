/* global _ */

function searchGithubUsers (string) {
  const url = 'https://api.github.com/search/users?q=' + string + '+in:login'
  window.fetch(url)
    .then(res => res.json())
    .then(data => Session.set('searchUsers', data.items.map(item => item.login)))
}

Template.actions.helpers({
  results: function () {
    return Session.get('searchUsers')
  }
})

Template.actions.events({
  // search github users
  'keyup .searchUser': _.debounce(function (event) {
    searchGithubUsers(event.target.value)
  }, 500),
  // add github user to form
  'click .searchResult': function (event) {
    document.querySelector('.searchUser').value = event.target.textContent
    Session.set('searchUsers', null)
  },
  // add collaborator to the gist
  'submit form': function (event) {
    event.preventDefault()
    Meteor.call('addCollaborator', this.gistId, event.target.searchUsers.value)
    event.target.searchUsers.value = ''
  }
})
