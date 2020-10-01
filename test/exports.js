/* --------------------
 * @overlook/plugin-react module
 * Tests
 * Test function to ensure all exports present
 * ------------------*/

/* eslint-disable jest/no-export */

'use strict';

// Exports

module.exports = function itExports(reactPlugin) {
	describe('symbols', () => {
		it.each([
			'REACT_FILE',
			'GET_REACT_FILE',
			'REACT_ROOT',
			'REACT_ROUTER',
			'REACT_ROUTER_ADD_ROUTE'
		])('%s', (key) => {
			expect(typeof reactPlugin[key]).toBe('symbol');
		});
	});
};
