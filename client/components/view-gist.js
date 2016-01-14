Template.viewGist.onCreated(function () {
  console.log(this)
  Session.set('gistOwnerId', this.data.ownerId)
  Session.set('gistCollaborators', this.data.collaborators)
})

Template.viewGist.helpers({
  owner: function () {
    return (Meteor.userId() && (Meteor.userId() === Session.get('gistOwnerId')))
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
  },
  "mouseover .gist-description": function(event, template) {
    $('[data-toggle="tooltip"]').tooltip()
  }
})
