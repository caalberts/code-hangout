Template.viewGist.onCreated(function () {
  Session.set('gistOwnerId', this.data.ownerId)
  Session.set('gistCollaborators', this.data.collaborators)
  Session.set('isOwner', (Meteor.userId() === Session.get('gistOwnerId')))
  const collaboratorIds = Session.get('gistCollaborators').map(user => user.githubId)
  Session.set('allowEdit', Meteor.userId() ? collaboratorIds.indexOf(Meteor.user().services.github.id) >= 0 : false)
})

Template.viewGist.helpers({
  owner: function () {
    return Session.get('isOwner')
  },
  allowEdit: function () {
    return Session.get('allowEdit')
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
