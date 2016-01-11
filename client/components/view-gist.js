Template.viewGist.helpers({
  description: function () {
    return JSON.parse(this.content).description
  },
  files: function () {
    console.log(JSON.parse(this.content).files)
    const array = Object.keys(JSON.parse(this.content).files).map(filename => JSON.parse(this.content).files[filename])
    return array
  }
})

Template.viewGist.events({
  'submit form': function(event) {
    event.preventDefault()

    const updateContent = {
      files: {}
    }
    updateContent.files[this.filename] = { content: event.target.gist.value }

    const url = 'https://api.github.com/gists/' + this.gistId
    const opts = {
      method: 'PATCH',
      headers: { Authorization: 'token ' + Meteor.user().services.github.accessToken },
      body: JSON.stringify(updateContent)
    }
    fetch(url, opts).then(res => console.log('success'))
      .catch(console.error)
  }
})
