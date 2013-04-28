// Chrome 26.0 (Mac) Rental App Public View should have navigation bar FAILED
//   http://localhost:9876/base/test/e2e/publicView.js?1367090205000:13:14: TypeError: Object [object Object] has no method 'injector'
// Firefox 20.0 (Mac) Rental App Public View should have navigation bar FAILED
//   http://localhost:9876/adapter/lib/angular-scenario.js?1365839301000:27057: TypeError: $document.injector is not a function
// These errors are due to a page not having ng-app or any other angular stuff in it.
// Looks like e2e testing is only for angular pages.
//


// Also check this out for testing: http://zachsnow.com/#!/blog/2013/expecting-expect-work-expected/

describe('Test App', function() {
  describe('Tab View', function() {
    beforeEach(function() {
      browser().navigateTo('/testbed');
    });

    it('should have tabs', function() {
      browser().navigateTo('/testbed');       
      expect(browser().location().path()).toBe('');
      expect(element('ul.nav-tabs').html()).toContain('Info');
      expect(element('ul.nav-tabs').html()).toContain('Info2');
      expect(element('ul.nav-tabs').html()).toContain('Dynamic Title 1');
      expect(element('ul.nav-tabs').html()).toContain('Dynamic Title 2');
      //expect(element('#janrainEngageEmbed').html()).toContain('.janrainContent');
    });
  });
});