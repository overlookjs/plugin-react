/* --------------------
 * @overlook/plugin-react module
 * Plugin tests
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	Route = require('@overlook/route'),
	matchPlugin = require('@overlook/plugin-match'),
	{HANDLE_ROUTE} = matchPlugin,
	reactPlugin = require('@overlook/plugin-react');

// Init
require('./support/index.js');

// Tests

describe('Plugin', () => {
	it('is an instance of Plugin class', () => {
		expect(reactPlugin).toBeInstanceOf(Plugin);
	});

	describe('when passed to `Route.extend()`', () => {
		it('returns subclass of Route', () => {
			const ReactRoute = Route.extend(reactPlugin);
			expect(ReactRoute).toBeFunction();
			expect(Object.getPrototypeOf(ReactRoute)).toBe(Route);
			expect(Object.getPrototypeOf(ReactRoute.prototype)).toBe(Route.prototype);
		});

		it('extends `.handle()` prototype method if not a match route', () => {
			const ReactRoute = Route.extend(reactPlugin);
			expect(ReactRoute.prototype.handle).toBeFunction();
			expect(ReactRoute.prototype.handle).not.toBe(Route.prototype.handle);
		});

		it('extends `[HANDLE_ROUTE]()` prototype method if a match route', () => {
			const MatchRoute = Route.extend(matchPlugin),
				ReactMatchRoute = MatchRoute.extend(reactPlugin);
			expect(ReactMatchRoute.prototype.handle).toBeFunction();
			expect(ReactMatchRoute.prototype.handle).toBe(MatchRoute.prototype.handle);
			expect(ReactMatchRoute.prototype[HANDLE_ROUTE]).toBeFunction();
			expect(ReactMatchRoute.prototype[HANDLE_ROUTE]).not.toBe(MatchRoute.prototype[HANDLE_ROUTE]);
		});
	});
});
