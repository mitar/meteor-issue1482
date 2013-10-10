var Test = new Meteor.Collection('test');

if (Meteor.isClient) {
  Meteor.startup(function () {
    Deps.autorun(function () {
      Meteor.subscribe('test', {
        onError: function (error) {
          Session.set('error', error.reason || "Bug!");
        }
      });
    });
  });

  Template.hello.error = function () {
    return Session.get('error');
  };
}

if (Meteor.isServer) {
  var Future = Npm.require('fibers/future');
  Meteor.publish('test', function () {
    uuid = Meteor.uuid();
    this.added('test', uuid, {test: "Test"});
    this.ready();

    //throw new Meteor.Error(500, "Some error, correct");

    var fut = new Future();
    fut.throw(new Meteor.Error(500, "Some error, correct"));
    fut.wait();
  });
}
