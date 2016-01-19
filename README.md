# Code Hangout

[![Travis](https://img.shields.io/travis/caalberts/code-hangout.svg?style=flat-square)](https://travis-ci.org/caalberts/code-hangout)
[![Join the chat at https://gitter.im/caalberts/code-hangout](https://badges.gitter.im/caalberts/code-hangout.svg)](https://gitter.im/caalberts/code-hangout?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Stories in Ready](https://badge.waffle.io/caalberts/code-hangout.png?label=ready&title=Ready)](https://waffle.io/caalberts/code-hangout)

Collaborative gist editor built with Meteor.

[![Code Hangout screenshot](/public/images/screenshot.png)](http://codehangout.meteor.com)

## Usage

Try it at [http://codehangout.meteor.com](http://codehangout.meteor.com) or clone this repo to start a local meteor instance.

## Features

- Retrieve gists from Github
- Create new gists
- Search and invite Github users to collaborate
- Concurrent editing with collaborators
- Update and publish gists to Github
- Live preview for Markdown files

## Libraries, Frameworks and APIs Used

1. [Meteor](https://www.meteor.com/)
2. [ShareJS](https://github.com/share/sharejs)
3. [CodeMirror](http://codemirror.net/)
4. [Github Gist API](https://developer.github.com/v3/gists/)
5. [showdown](https://github.com/showdownjs/showdown)
6. [iron router](http://iron-meteor.github.io/iron-router/)

## Approach and Implementation

1. Identify problem - collaboration potential on Gists
  - Process notes: [link](https://gist.github.com/calvintan/389ea997f0c66304717e#file-code-hangout-process-md)
2. Research tools - real-time, text editor
3. Meteor, ShareJS and Codemirror forms the foundation of the real time collaborative text editor.
4. Gists documents are retrieved and published to Github through Github Gists API
5. Client side routing using iron router to show user's dashboard and gists.
6. Markdown files are rendered to HTML using showdown
6. Visual and interaction design

## Challenges

- Notes on problems encountered and how they were solved: [link](https://gist.github.com/calvintan/389ea997f0c66304717e#file-code-hangout-learning-md)

## Outstanding Issues

- Continuous integration with Travis
- Test driven development
- [Issues](https://github.com/caalberts/code-hangout/issues)

## Collaborators

- [@caalberts](https://github.com/caalberts)
- [@calvintan](https://github.com/calvintan)
