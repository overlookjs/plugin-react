/* --------------------
 * @overlook/plugin-react module
 * Tests
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	Route = require('@overlook/route'),
	reactPlugin = require('@overlook/plugin-react');

// Init
require('./support/index.js');

// Tests

describe('Plugin', () => { // eslint-disable-line jest/lowercase-name
	it('is an instance of Plugin class', () => {
		expect(reactPlugin).toBeInstanceOf(Plugin);
	});

	it('when passed to `Route.extend()`, returns subclass of Route', () => {
		const ReactRoute = Route.extend(reactPlugin);
		expect(ReactRoute).toBeFunction();
		expect(Object.getPrototypeOf(ReactRoute)).toBe(Route);
		expect(Object.getPrototypeOf(ReactRoute.prototype)).toBe(Route.prototype);
	});
});
