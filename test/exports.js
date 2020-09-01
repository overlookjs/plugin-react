/* --------------------
 * @overlook/plugin-react module
 * Tests
 * Test function to ensure all exports present
 * ------------------*/

/* eslint-disable jest/no-export */

'use strict';

// Exports

module.exports = function itExports(reactPlugin) {
	describe.skip('methods', () => { // eslint-disable-line jest/no-disabled-tests
		it.each([
			'TEMP'
		])('%s', (key) => {
			expect(reactPlugin[key]).toBeFunction();
		});
	});

	describe('symbols', () => {
		it.each([
			'TEMP'
		])('%s', (key) => {
			expect(typeof reactPlugin[key]).toBe('symbol');
		});
	});
};
