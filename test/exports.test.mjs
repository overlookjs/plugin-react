/* --------------------
 * @overlook/plugin-react module
 * Tests
 * ESM export
 * ------------------*/

// Modules
import Plugin from '@overlook/plugin';
import reactPlugin, * as namedExports from '@overlook/plugin-react/es';

// Imports
import itExports from './exports.js';

// Tests

describe('ESM export', () => {
	it('default export is an instance of Plugin class', () => {
		expect(reactPlugin).toBeInstanceOf(Plugin);
	});

	describe('default export has properties', () => {
		itExports(reactPlugin);
	});

	describe('named exports', () => {
		itExports(namedExports);
	});
});
