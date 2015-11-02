# mocha-wav

The `mocha-wav` UI is a [third-party mocha UI](https://github.com/mochajs/mocha/wiki/Third-party-UIs) that enhances the standard Mocha BDD UI to include `when()`, `action()`, `verify()`, and `afterVerify()` functions. It simplifies building tests where the same actions and assertions should be run against various setup data.

While `beforeEach` enables you to use the same setup data for all tests, `mocha-wav` supports the inverse, enabling you to run the same assertions against multiple setup data.

Internally, `mocha-wav` creates a mocha `it` for each `when` defined. This `it` chains calls to the `when`, `action`, and `verify` functions. This enables you to write multiple test cases that perform the same action and verify logic, but with a different setup (`when` functions) for each test.

```js
// Pseudocode representing the "it" generated for a single "when" declaration
it("when user is happy", function(done) {
  whenFunction(function(whenResult) {
    actionFunction(whenResult, function(actionResult) {
      verifyFunction(whenResult, actionResult);
      afterVerifyFunction(whenResult, actionResult, done);
    });
  });
});
​```

# Use
​
## Install

Install the module into your project:

```
npm install mocha-wav --save-dev
```

Override the default mocha UI by configuring mocha to use the `mocha-wav` UI:

```
mocha --ui mocha-wav test.js
```

When using `gulp-mocha`:

```
var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function () {
  return gulp.src('test.js', {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({
      ui: 'mocha-wav',
      reporter: 'nyan'
    }));
});
```

## API
​
### action

Only one `action` may be defined within a `describe` context. If more than one is defined, that last one defined is used. The `action` function is asynchronous and should be defined before defining `when` scenarios.

```
action(function(whenResult, next){

});
​```

### verify

Only one `verify` may be defined within a `describe` context. If more than one is defined, that last one defined is used. The `verify` function is **synchronous** and should be defined before defining `when` scenarios.

```
verify(function (whenResult, actionResult) {
​
});
​```

### afterVerify

Only one `afterVerify` may be defined within a `describe` context. If more than one is defined, that last one defined is used. The `afterVerify` function is asynchronous and should be defined before defining `when` scenarios.

```
afterVerify(function (whenResult, actionResult, next) {
​
});
​```

### When

Multiple `when`s may be defined within a `describe` context. The `when` functions are asynchronous should be defined after `action` and `verify` definitions.

```
when("something is set", function (next){
​
});
```
​
# Contribute

No formal process other than the *standard opensource flow*:​

* Fork
* Modify
* Test
* Pull Request



