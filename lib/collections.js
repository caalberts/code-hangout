/* global Mongo */

Gists = new Mongo.Collection('gists') // eslint-disable-line no-undef
Files = new Mongo.Collection('files') // eslint-disable-line no-undef
// TODO use of Documents collection to be reviewed
Documents = new Mongo.Collection('documents') // eslint-disable-line no-undef
EditingUsers = new Mongo.Collection('editingUsers') // eslint-disable-line no-undef
