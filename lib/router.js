if (Meteor.isClient){
  Accounts.onLogin(function(){
    FlowRouter.go('dashboard')
  })

  Accounts.onLogout(function(){
    FlowRouter.go('home')
  })
}

FlowRouter.triggers.enter([function(context, redirect){
  if(!Meteor.userId()){
    FlowRouter.go('home')
  }
}])

FlowRouter.route('/', {
  name: 'home',
  action(){
    if(Meteor.userId()){
      FlowRouter.go('dashboard')
    }
    BlazeLayout.render('home')
  }
})

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action(){
    BlazeLayout.render('dashboard', {content: 'main'})
  }
})

FlowRouter.route('/dashboard/profile', {
  name: 'profile',
  action(){
    BlazeLayout.render('dashboard', {content: 'listGists'})
  }
})

// FlowRouter.route('/gist/:gistId', {
//   name: 'profile',
//   action(){
//     BlazeLayout.render('dashboard', {content: 'listGists'})
//   }
// })
//
// Router.route('/gist/:gistId', {
//   template: 'viewGist',
//   data: function () {
//     return Gists.findOne({ gistId: this.params.gistId })
//   }
// })
