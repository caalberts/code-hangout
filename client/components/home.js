Template.home.helpers({
  recentGists: function () {
    return Gists.find({}, {
      sort: { updated_at: -1 },
      limit: 4
    })
  }
})
