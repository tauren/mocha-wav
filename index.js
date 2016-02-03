"use strict";

var Mocha    = require('mocha');
var Suite    = require('mocha/lib/suite');
var Test     = require('mocha/lib/test');
var escapeRe = require('escape-string-regexp');

module.exports = Mocha.interfaces['mocha-wav'] = function(suite) {
  var suites = [suite];

  suite.on('pre-require', function(context, file, mocha) {
    var common = require('mocha/lib/interfaces/common')(suites, context);

    /**
     * Use all existing hook logic common to UIs. Common logic can be found in
     * https://github.com/mochajs/mocha/blob/master/lib/interfaces/common.js
     */
    context.beforeEach = common.beforeEach;
    context.afterEach = common.afterEach;
    context.before = common.before;
    context.after = common.after;
    context.run = mocha.options.delay && common.runWithSuite(suite);

    context.describe = context.context = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suite.file = file;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
      return suite;
    };


    /**
     * Pending describe.
     */

    context.xdescribe =
    context.xcontext =
    context.describe.skip = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suite.pending = true;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
    };

    /**
     * Exclusive suite.
     */

    context.describe.only = function(title, fn){
      var suite = context.describe(title, fn);
      mocha.grep(suite.fullTitle());
      return suite;
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.it = context.specify = function(title, fn){
      var suite = suites[0];
      if (suite.pending) fn = null;
      var test = new Test(title, fn);
      test.file = file;
      suite.addTest(test);
      return test;
    };

    /**
     * Exclusive test-case.
     */

    context.it.only = function(title, fn){
      var test = context.it(title, fn);
      var reString = '^' + escapeRe(test.fullTitle()) + '$';
      mocha.grep(new RegExp(reString));
      return test;
    };

    /**
     * Pending test case.
     */

    context.xit =
    context.xspecify =
    context.it.skip = function(title){
      context.it(title);
    };

    // ------------------------------------------------------- //
    // Everything above here was copied from mocha's bdd.js UI //
    // TODO: Find a way to simply extend bdd.js with additions //
    // ------------------------------------------------------- //

    /**
     * Defines an `actionFn` to be used by any following `when()` calls
     */
    context.action = function(actionFn){
      var suite = suites[0];
      suite.actionFn = actionFn;
    };

    /**
     * Defines a `verifyFn` to be used by any following `when()` calls
     */
    context.verify = function(verifyFn){
      var suite = suites[0];
      suite.verifyFn = verifyFn;
    };

    /**
     * Defines a `afterVerifyFn` to be used by any following `when()` calls
     */
    context.afterVerify = function(afterVerifyFn){
      var suite = suites[0];
      suite.afterVerifyFn = afterVerifyFn;
    };

    /**
     * Describes a specification or test-case with the given
     * `title` that builds a thunk with the given `whenFn`.
     * calls.
     */
    context.when = function(title, whenFn){
      var suite = suites[0];
      var itFn;
      if (whenFn) {
        var actionFn = suite.actionFn || function(whenResults, next) { next(); };
        var verifyFn = suite.verifyFn || function(actionResults, whenResults) {};
        var afterVerifyFn = suite.afterVerifyFn || function(actionResults, whenResults, next) { next(); };
        itFn = function(done) {
          whenFn.call(this, function(err, whenResults) {
            if (err) return done(err);
            // if (err) throw err;
            actionFn.call(this, whenResults, function(err, actionResults) {
              if (err) return done(err);
              // if (err) throw err;
              verifyFn.call(this, whenResults, actionResults);
              afterVerifyFn.call(this, whenResults, actionResults, function(err) {
                if (err) return done(err);
                done();
              });
            }.bind(this));
          }.bind(this));
        };
      }
      if (suite.pending) itFn = null;
      var test = new Test("when " + title, itFn);
      test.file = file;
      suite.addTest(test);
      return test;
    };

    /**
     * Exclusive when.
     */

    context.when.only = function(title, fn){
      var test = context.when(title, fn);
      var reString = '^' + escapeRe(test.fullTitle()) + '$';
      mocha.grep(new RegExp(reString));
      return test;
    };

    /**
     * Pending when.
     */

    context.xwhen =
    context.when.skip = function(title){
      context.when(title);
    };
  });
};
