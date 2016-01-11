Template.viewGist.onCreated(function () {
  console.dir(this.data)

  const filenames = Object.keys(this.data.files)
  console.log(filenames)
  filenames.forEach(filename => {

    console.log('fetching raw files');
    fetch(this.data.files[filename].raw_url)
      .then(res => res.text())
      .then(data => {
        const fileObj = {
          gistId: this.data.id,
          filename: filename,
          url: this.data.files.raw_url,
          content: data
        }
        Session.set(filename, fileObj)
      })
  })
})

Template.viewGist.helpers({
  files: function () {
    const files = Object.keys(this.files)
    return files.map(file => Session.get(file))
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
