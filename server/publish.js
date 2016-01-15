Meteor.publish('user', function () {
  if (this.userId) {
    const user = Meteor.users.find(this.userId)
    return user
  } else {
    this.ready()
  }
})
Meteor.publish('gists', function () {
  return Gists.find({ public: true })
})
Meteor.publish('files', function () {
  return Files.find()
})
Meteor.publish('edits', function () {
  return Edits.find()
})
// TODO publish
// - private gists and files for owner
// - private gists and files for collaborators
// - public gists and files
