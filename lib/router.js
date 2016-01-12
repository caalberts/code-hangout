/* global Router, Gists */

Router.configure({
  layoutTemplate: 'main'
})

Router.route('/', {
  template: 'home'
})

Router.route('/profile', {
  template: 'listGists'
})

Router.route('/gist/:gistId', {
  template: 'viewGist',
  data: function () {
    return Gists.findOne({ gistId: this.params.gistId })
  }
})
