Meteor.startup(function () {
  WebFontConfig = {
    google: { families: [ 'Montserrat:700:latin', 'Lato:300,300italic:latin' ] }
  };
  (function () {
    var wf = document.createElement('script')
    wf.src = (document.location.protocol === 'https' ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
    wf.type = 'text/javascript'
    wf.async = 'true'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(wf, s)
  })()
})
