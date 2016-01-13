/* global Blaze */

Template.createGist.events({
  'submit form': function (event, template) {
    event.preventDefault()
    console.dir(template)
    // Blaze.remove(template.createGist)
  }
})
