"use strict";

var expect = require("chai").expect;

describe("WAV happy path", function() {

  action(function(setupResult,next){
    var actionResult = {
      action: "foo",
      number: setupResult.data
    };
    next(null, actionResult);
  });

  verify(function(setupResult, actionResult) {
    expect(actionResult).to.exist;
    expect(actionResult.action).to.equal("foo");
    expect(actionResult.number).to.equal(setupResult.data);
  });

  when("one", function (next){
    next(null, { data: "one" });
  });
  when("two", function (next){
    next(null, { data: "two" });
  });
  when("three", function (next){
    next(null, { data: "three" });
  });

});

// TODO: Figure out how to test error conditions
describe.skip("WHEN sad path", function() {

  action(function(setupResult,next){
    if (setupResult)
      return next(null, true);
    next(new Error("action failed"));
  });

  verify(function(setupResult, actionResult) {
    console.log(setupResult, actionResult);
  });

  when("action fails", function (next){
    next(null, false);
    // expect(next(null, false)).to.throw(/action failed/);
  });
  when("setup fails", function (next){
    next(new Error("setup failed"));
    // expect(next(new Error("setup failed"))).to.throw(/setup failed/);
  });
  when("verify fails", function (next){
    next(null, true);
    // expect(next(null, true)).to.throw(AssertionError);
  });

});

