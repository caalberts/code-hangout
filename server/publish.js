Meteor.publish('user', function () {
  if (this.userId) {
    const user = Meteor.users.find(this.userId)
    return user
  }
})
Meteor.publish('gists', function () {
  return Gists.find()
})
Meteor.publish('files', function () {
  return Files.find()
})

// TODO publish
// - private gists and files for owner
// - private gists and files for collaborators
// - public gists and files
