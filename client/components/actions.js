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
  'keyup .searchUser': _.debounce(function (event) {
    console.dir(event)
    searchGithubUsers(event.target.value)
  }, 500),
  'submit form': function (event) {
    event.preventDefault()
    searchGithubUsers(event.target.searchUsers.value)
  },
  'click .searchResult': function (event) {
    console.log('user', event.target.textContent)
    Session.set('searchUsers', null)
  }
})
