Template.viewGist.onCreated(function () {
  Session.set('gistOwnerId', this.data.ownerId)
  Session.set('gistCollaborators', this.data.collaborators)
  Session.set('isOwner', (Meteor.userId() === Session.get('gistOwnerId')))
  const collaboratorIds = Session.get('gistCollaborators').map(user => user.githubId)
  Session.set('allowEdit', Meteor.userId() ? collaboratorIds.indexOf(Meteor.user().services.github.id) >= 0 : false)
  const file = Files.findOne({ gistId: Session.get('gistId') })
  if (file) Session.set('fileId', file._id)
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
  },
  'mouseover .gist-description': function (event, template) {
    $('[data-toggle="tooltip"]').tooltip()
  }
})

Template.gistOptions.events({
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
  }
})
