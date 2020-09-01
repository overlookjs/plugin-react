/* --------------------
 * @overlook/plugin-react module
 * Tests
 * CJS export
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	reactPlugin = require('@overlook/plugin-react');

// Imports
const itExports = require('./exports.js');

// Tests

describe('CJS export', () => {
	it('is an instance of Plugin class', () => {
		expect(reactPlugin).toBeInstanceOf(Plugin);
	});

	describe('has properties', () => {
		itExports(reactPlugin);
	});
});
