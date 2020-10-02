/* --------------------
 * @overlook/plugin-react module
 * Handle tests
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	matchPlugin = require('@overlook/plugin-match'),
	{HANDLE_ROUTE} = matchPlugin,
	reactPlugin = require('@overlook/plugin-react'),
	{REACT_ROOT, REACT_ROUTER, ROUTER_ADD_ROUTE} = reactPlugin;

// Init
const {spy} = require('./support/index.js');

// Tests

const ReactRoute = Route.extend(reactPlugin),
	MatchRoute = Route.extend(matchPlugin),
	ReactMatchRoute = MatchRoute.extend(reactPlugin);

describe('Handle', () => {
	describe('`.handle()` on normal route', () => {
		it('for root, returns undefined', async () => {
			const root = new ReactRoute();
			root[REACT_ROOT] = root;
			await root.init();
			expect(root.handle()).toBeUndefined();
		});

		it('for child, calls `.handle()` on root', async () => {
			const root = new ReactRoute();
			root[REACT_ROOT] = root;
			root[REACT_ROUTER] = root;
			root[ROUTER_ADD_ROUTE] = () => {};
			const res = {};
			root.handle = spy(() => res);
			const child = new ReactRoute({name: 'child'});
			root.attachChild(child);
			await root.init();

			const req = {};
			expect(child.handle(req)).toBe(res);
			expect(root.handle).toHaveBeenCalledTimes(1);
			expect(root.handle).toHaveBeenCalledWith(req);
		});
	});

	describe('[HANDLE_ROUTE]()` on match route', () => {
		it('for root, returns undefined', async () => {
			const root = new ReactMatchRoute();
			root[REACT_ROOT] = root;
			await root.init();
			expect(root[HANDLE_ROUTE]()).toBeUndefined();
		});

		it('for child, calls `[HANDLE_ROUTE]()` on root', async () => {
			const root = new ReactMatchRoute();
			root[REACT_ROOT] = root;
			root[REACT_ROUTER] = root;
			root[ROUTER_ADD_ROUTE] = () => {};
			const res = {};
			root[HANDLE_ROUTE] = spy(() => res);
			const child = new ReactMatchRoute({name: 'child'});
			root.attachChild(child);
			await root.init();

			const req = {};
			expect(child[HANDLE_ROUTE](req)).toBe(res);
			expect(root[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
			expect(root[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
		});
	});
});
