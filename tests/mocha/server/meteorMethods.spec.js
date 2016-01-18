/* global sinon chai describe it before Meteor Files Gists fetch */
const expect = chai.expect
const OK = 200
let origMeteor
let origGists
let origFiles

describe('retrieve Gist', function () {
  before(done => {
    // stub fetch
    const json = {
      'description': 'description of gist',
      'public': true,
      'owner': {
        'login': 'octocat',
        'id': 1,
        'avatar_url': 'https://github.com/images/error/octocat_happy.gif',
        'url': 'https://api.github.com/users/octocat',
        'html_url': 'https://github.com/octocat',
        'type': 'User',
        'site_admin': false
      },
      'files': {
        'ring.erl': {
          'raw_url': 'https://gist.githubusercontent.com/raw/365370/8c4d2d43d178df44f4c03a7f2ac0ff512853564e/ring.erl',
          'type': 'text/plain',
          'truncated': false,
          'language': 'Erlang'
        }
      },
      'created_at': '2010-04-14T02:15:15Z',
      'updated_at': Date.now() - 1000 * 60 * 60 * 24 // updated yesterday
    }
    const res = {
      status: 200,
      json: () => json
    }
    fetch = sinon.stub().returns(new Promise((resolve, reject) => {
      resolve(res)
    }))
    // stub Meteor objects
    origMeteor = Meteor
    Meteor = {
      user: sinon.stub(),
      userId: sinon.stub(),
      call: origMeteor.call
    }
    origGists = Gists
    Gists = {
      findOne: sinon.stub(),
      upsert: sinon.stub()
    }
    origFiles = Files
    Files = {
      upsert: sinon.stub()
    }
    done()
  })

  // reset Meteor objects
  after(done => {
    Meteor = origMeteor
    Gists = origGists
    Files = origFiles
    done()
  })

  it('should call fetch to Github API', done => {
    const userObj = {
      services: {
        github: {
          accessToken: 1234
        }
      }
    }
    Meteor.user.returns(userObj)
    Meteor.userId.returns(1234)

    Meteor.call('retrieveGistFiles', 1234, () => {
      expect(fetch).to.have.been.called
    })
    done()
  })
  it('should receive for an OK response', done => {
    Meteor.call('retrieveGistFiles', 1234, () => {
      expect(fetch.then(res => res.status)).to.equal(OK)
    })
    done()
  })
  it('should check for existing Gist in app\'s database', done => {
    Meteor.call('retrieveGistFiles', 1234, () => {
      expect(Gists.findOne).to.have.been.called
    })
    done()
  })
  it('should create new Gist in database if Github\'s gist is more recent', done => {
    Gists.findOne.returns({
      updated_at: Date.parse('1 jan 1990')
    })
    Meteor.call('retrieveGistFiles', 1234, () => {
      expect(Gists.upsert).to.have.been.called
    })
    done()
  })
  it('should not create new Gist in database if local gist is more recent', done => {
    Gists.findOne.returns({
      updated_at: Date.now()
    })
    Meteor.call('retrieveGistFiles', 1234, () => {
      expect(Gists.upsert).to.not.have.been.called
    })
    done()
  })
  it('should create or update Files with files from gist', done => {
    Gists.findOne.returns({
      updated_at: Date.parse('1 jan 1990')
    })
    Meteor.call('retrieveGistFiles', 1234, () => {
      const fileCount = Object.keys(json.files).length
      expect(Files.upsert).to.have.callCount(fileCount)
    })
    done()
  })
})
