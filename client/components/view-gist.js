
Template.viewGist.helpers({
  'editable': function () {
    return (Meteor.userId() === this.ownerId) ? 'true' : 'false'
  }
})

Template.viewGist.events({
  'focus .gist-description': function (event) {
    Session.set('prevDesc', event.target.textContent)
  },
  'blur .gist-description': function (event) {
    if (event.target.textContent !== Session.get('prevDesc')) {
      Meteor.call('renameGist', this.gistId, event.target.textContent)
    }
  }
})
