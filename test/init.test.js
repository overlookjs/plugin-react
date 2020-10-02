/* --------------------
 * @overlook/plugin-react module
 * Init tests
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{File} = require('@overlook/plugin-fs'),
	pathPlugin = require('@overlook/plugin-path'),
	reactPlugin = require('@overlook/plugin-react'),
	{FILES} = require('@overlook/plugin-load'),
	{
		REACT_FILE, GET_REACT_FILE, REACT_ROOT, REACT_ROUTER, ROUTER_ADD_ROUTE, IS_LAZY, GET_IS_LAZY
	} = reactPlugin;

// Init
const {spy} = require('./support/index.js');

// Tests

const ReactRoute = Route.extend(reactPlugin),
	PathRoute = Route.extend(pathPlugin),
	ReactPathRoute = PathRoute.extend(reactPlugin);

describe('Init', () => {
	describe('`[INIT_PROPS]()` defines undefined', () => {
		it.each([
			'REACT_FILE',
			'REACT_ROOT',
			'REACT_ROUTER',
			'IS_LAZY'
		])('%s', (propName) => {
			const route = new ReactRoute();

			const symbol = reactPlugin[propName];
			expect(typeof symbol).toBe('symbol');
			expect(route).toContainEntry([symbol, undefined]);
		});
	});

	describe('determines `[REACT_FILE]`', () => {
		it('from `[GET_REACT_FILE]()` if `[REACT_FILE]` undefined', async () => {
			const route = new ReactRoute();
			route[REACT_ROOT] = route;
			const file = new File('/a/b/c');
			route[GET_REACT_FILE] = () => file;
			await route.init();
			expect(route[REACT_FILE]).toBe(file);
		});

		it('from `[FILES].jsx` if `[REACT_FILE]` undefined', async () => {
			const route = new ReactRoute();
			route[REACT_ROOT] = route;
			const file = new File('/a/b/c');
			route[FILES] = {jsx: file};
			await route.init();
			expect(route[REACT_FILE]).toBe(file);
		});

		it('does not call `[GET_REACT_FILE]()` if `[REACT_FILE]` defined', async () => {
			const route = new ReactRoute();
			route[REACT_ROOT] = route;
			const file = new File('/a/b/c');
			route[REACT_FILE] = file;
			route[GET_REACT_FILE] = spy(() => {});
			await route.init();
			expect(route[REACT_FILE]).toBe(file);
			expect(route[GET_REACT_FILE]).not.toHaveBeenCalled();
		});
	});

	describe('determines `[IS_LAZY]`', () => {
		it(
			'from `[GET_IS_LAZY]()` if `[IS_LAZY]` undefined',
			async () => {
				const route = new ReactRoute();
				route[REACT_ROOT] = route;
				route[GET_IS_LAZY] = () => false;
				await route.init();
				expect(route[IS_LAZY]).toBe(false);
			}
		);

		it('does not call `[GET_IS_LAZY]()` if `[IS_LAZY]` defined', async () => {
			const route = new ReactRoute();
			route[REACT_ROOT] = route;
			route[IS_LAZY] = true;
			route[GET_IS_LAZY] = spy(() => false);
			await route.init();
			expect(route[IS_LAZY]).toBe(true);
			expect(route[GET_IS_LAZY]).not.toHaveBeenCalled();
		});
	});

	describe('inherits `[REACT_ROOT]` from', () => {
		it('self when root', async () => {
			const root = new ReactRoute();
			root[REACT_ROOT] = root;
			await root.init();
			expect(root[REACT_ROOT]).toBe(root);
		});

		it('self when not root', async () => {
			const root = new ReactRoute();
			root[REACT_ROOT] = root;
			const child = new ReactRoute();
			child[REACT_ROOT] = child;
			root.attachChild(child);
			await root.init();
			expect(child[REACT_ROOT]).toBe(child);
		});

		it('parent', async () => {
			const root = new ReactRoute();
			root[REACT_ROOT] = root;
			root[REACT_ROUTER] = root;
			root[ROUTER_ADD_ROUTE] = () => {};
			const child = new ReactRoute({name: 'child'});
			root.attachChild(child);
			await root.init();
			expect(child[REACT_ROOT]).toBe(root);
		});

		it('ancestor', async () => {
			const root = new ReactRoute();
			root[REACT_ROOT] = root;
			root[REACT_ROUTER] = root;
			root[ROUTER_ADD_ROUTE] = () => {};
			const child = new ReactRoute({name: 'child'});
			root.attachChild(child);
			const childOfChild = new ReactRoute({name: 'childOfChild'});
			child.attachChild(childOfChild);
			await root.init();
			expect(childOfChild[REACT_ROOT]).toBe(root);
		});

		it('ancestor where not router root', async () => {
			const root = new Route();
			const child = new ReactRoute({name: 'child'});
			child[REACT_ROOT] = child;
			child[REACT_ROUTER] = child;
			child[ROUTER_ADD_ROUTE] = () => {};
			root.attachChild(child);
			const childOfChild = new ReactRoute({name: 'childOfChild'});
			child.attachChild(childOfChild);
			const childOfChildOfChild = new ReactRoute({name: 'childOfChildOfChild'});
			childOfChild.attachChild(childOfChildOfChild);
			await root.init();
			expect(childOfChildOfChild[REACT_ROOT]).toBe(child);
		});
	});

	describe('inherits `[REACT_ROUTER]` from', () => {
		it('self when root', async () => {
			const root = new ReactRoute();
			root[REACT_ROOT] = root;
			root[REACT_ROUTER] = root;
			root[ROUTER_ADD_ROUTE] = () => {};
			await root.init();
			expect(root[REACT_ROUTER]).toBe(root);
		});

		it('self when not root', async () => {
			const root = new ReactRoute();
			root[REACT_ROOT] = root;
			const child = new ReactRoute({name: 'child'});
			child[REACT_ROUTER] = child;
			child[ROUTER_ADD_ROUTE] = () => {};
			root.attachChild(child);
			await root.init();
			expect(child[REACT_ROUTER]).toBe(child);
		});

		it('parent', async () => {
			const root = new ReactRoute();
			root[REACT_ROOT] = root;
			root[REACT_ROUTER] = root;
			root[ROUTER_ADD_ROUTE] = () => {};
			const child = new ReactRoute({name: 'child'});
			root.attachChild(child);
			await root.init();
			expect(child[REACT_ROUTER]).toBe(root);
		});

		it('ancestor', async () => {
			const root = new ReactRoute();
			root[REACT_ROOT] = root;
			root[REACT_ROUTER] = root;
			root[ROUTER_ADD_ROUTE] = () => {};
			const child = new ReactRoute({name: 'child'});
			root.attachChild(child);
			const childOfChild = new ReactRoute({name: 'childOfChild'});
			child.attachChild(childOfChild);
			await root.init();
			expect(childOfChild[REACT_ROUTER]).toBe(root);
		});

		it('ancestor where not router root', async () => {
			const root = new Route();
			const child = new ReactRoute({name: 'child'});
			child[REACT_ROOT] = child;
			child[REACT_ROUTER] = child;
			child[ROUTER_ADD_ROUTE] = () => {};
			root.attachChild(child);
			const childOfChild = new ReactRoute({name: 'childOfChild'});
			child.attachChild(childOfChild);
			const childOfChildOfChild = new ReactRoute({name: 'childOfChildOfChild'});
			childOfChild.attachChild(childOfChildOfChild);
			await root.init();
			expect(childOfChildOfChild[REACT_ROUTER]).toBe(child);
		});
	});

	describe('adds route to router when router is', () => {
		it('self when root', async () => {
			const root = new ReactPathRoute();
			root[REACT_ROOT] = root;
			root[REACT_ROUTER] = root;
			root[ROUTER_ADD_ROUTE] = spy(() => {});
			const file = new File('/a/b/c');
			root[REACT_FILE] = file;
			await root.init();
			expect(root[ROUTER_ADD_ROUTE]).toHaveBeenCalledTimes(1);
			expect(root[ROUTER_ADD_ROUTE]).toHaveBeenCalledWith(file, '/', true, false);
		});

		it('self when not root', async () => {
			const root = new ReactPathRoute();
			root[REACT_ROOT] = root;
			const child = new ReactPathRoute({name: 'child'});
			child[REACT_ROUTER] = child;
			child[ROUTER_ADD_ROUTE] = spy(() => {});
			const file = new File('/a/b/c');
			child[REACT_FILE] = file;
			root.attachChild(child);
			await root.init();
			expect(child[ROUTER_ADD_ROUTE]).toHaveBeenCalledTimes(1);
			expect(child[ROUTER_ADD_ROUTE]).toHaveBeenCalledWith(file, '/child', true, false);
		});

		it('parent', async () => {
			const root = new ReactPathRoute();
			root[REACT_ROOT] = root;
			root[REACT_ROUTER] = root;
			root[ROUTER_ADD_ROUTE] = spy(() => {});
			const child = new ReactPathRoute({name: 'child'});
			const file = new File('/a/b/c');
			child[REACT_FILE] = file;
			root.attachChild(child);
			await root.init();
			expect(root[ROUTER_ADD_ROUTE]).toHaveBeenCalledTimes(1);
			expect(root[ROUTER_ADD_ROUTE]).toHaveBeenCalledWith(file, '/child', true, false);
		});

		it('ancestor', async () => {
			const root = new ReactPathRoute();
			root[REACT_ROOT] = root;
			root[REACT_ROUTER] = root;
			root[ROUTER_ADD_ROUTE] = spy(() => {});
			const child = new ReactPathRoute({name: 'child'});
			root.attachChild(child);
			const childOfChild = new ReactPathRoute({name: 'childOfChild'});
			const file = new File('/a/b/c');
			childOfChild[REACT_FILE] = file;
			child.attachChild(childOfChild);
			await root.init();
			expect(childOfChild[REACT_ROUTER]).toBe(root);
			expect(root[ROUTER_ADD_ROUTE]).toHaveBeenCalledTimes(1);
			expect(root[ROUTER_ADD_ROUTE]).toHaveBeenCalledWith(
				file, '/child/childOfChild', true, false
			);
		});

		it('ancestor where not router root', async () => {
			const root = new PathRoute();
			const child = new ReactPathRoute({name: 'child'});
			child[REACT_ROOT] = child;
			child[REACT_ROUTER] = child;
			child[ROUTER_ADD_ROUTE] = spy(() => {});
			root.attachChild(child);
			const childOfChild = new ReactPathRoute({name: 'childOfChild'});
			child.attachChild(childOfChild);
			const childOfChildOfChild = new ReactPathRoute({name: 'childOfChildOfChild'});
			const file = new File('/a/b/c');
			childOfChildOfChild[REACT_FILE] = file;
			childOfChild.attachChild(childOfChildOfChild);
			await root.init();
			expect(child[ROUTER_ADD_ROUTE]).toHaveBeenCalledTimes(1);
			expect(child[ROUTER_ADD_ROUTE]).toHaveBeenCalledWith(
				file, '/child/childOfChild/childOfChildOfChild', true, false
			);
		});
	});
});
