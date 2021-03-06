/* --------------------
 * @overlook/plugin-react module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	{INIT_PROPS, INIT_ROUTE} = require('@overlook/route'),
	{FILES} = require('@overlook/plugin-load'),
	{HANDLE_ROUTE, URL_PATH} = require('@overlook/plugin-path'),
	{PRE_BUILD, deleteRouteProperties} = require('@overlook/plugin-build'),
	{findParent} = require('@overlook/util-find-parent'),
	assert = require('simple-invariant'),
	{isBoolean} = require('is-it-type');

// Imports
const pkg = require('../package.json');

// Exports

module.exports = new Plugin(
	pkg,
	{
		symbols: [
			'REACT_FILE', 'GET_REACT_FILE', 'REACT_ROOT', 'REACT_ROUTER', 'ROUTER_ADD_ROUTE',
			'IS_LAZY', 'GET_IS_LAZY'
		]
	},
	(Route, {
		REACT_FILE, GET_REACT_FILE, REACT_ROOT, REACT_ROUTER, ROUTER_ADD_ROUTE,
		IS_LAZY, GET_IS_LAZY
	}) => {
		// Extend `[HANDLE_ROUTE]()` if defined, otherwise extend `handle()`
		const handleRouteMethodName = Route.prototype[HANDLE_ROUTE] ? HANDLE_ROUTE : 'handle';

		return class ReactRoute extends Route {
			/**
			 * Init properties.
			 * @param {Object} props - Props object
			 * @returns {undefined}
			 */
			[INIT_PROPS](props) {
				super[INIT_PROPS](props);
				this[REACT_FILE] = undefined;
				this[REACT_ROOT] = undefined;
				this[REACT_ROUTER] = undefined;
				this[IS_LAZY] = undefined;
			}

			/**
			 * Init React file, locate react root + router, add this route to router.
			 * @returns {undefined}
			 */
			async [INIT_ROUTE]() {
				// Delegate to super classes
				await super[INIT_ROUTE]();

				// Init React file
				let file = this[REACT_FILE];
				if (!file) {
					file = this[GET_REACT_FILE]();
					if (file) this[REACT_FILE] = file;
				}

				// Locate React root
				let rootRoute = this[REACT_ROOT]; // `plugin-react-root` will define this if is root
				if (!rootRoute) {
					// eslint-disable-next-line no-return-assign
					findParent(this, route => rootRoute = route[REACT_ROOT]);
					assert(rootRoute, 'React routes must have a React root (use @overlook/react-root)');
					this[REACT_ROOT] = rootRoute;
				}

				// Locate React router above
				let routerRoute = this[REACT_ROUTER]; // `plugin-react-router` will define this if is router
				if (!routerRoute && rootRoute !== this) {
					// eslint-disable-next-line no-return-assign
					findParent(this, route => routerRoute = route[REACT_ROUTER]);
					assert(
						routerRoute,
						'React routes must have a parent router if not React root (use @overlook/react-router)'
					);
					this[REACT_ROUTER] = routerRoute;
				}

				// Determine if route is lazy-loaded (default is lazy)
				let isLazy = this[IS_LAZY];
				if (isLazy != null) {
					assert(isBoolean(isLazy), '[IS_LAZY] must be true, false, undefined or null');
				} else {
					isLazy = this[GET_IS_LAZY]();
					if (isLazy !== undefined) {
						assert(isBoolean(isLazy), '[GET_IS_LAZY]() must return true, false or undefined');
					} else {
						isLazy = true;
					}
					this[IS_LAZY] = isLazy;
				}

				// If using router, add route to router
				if (routerRoute && file) routerRoute[ROUTER_ADD_ROUTE](file, this[URL_PATH], isLazy, false);
			}

			/**
			 * Get React file.
			 * Can be extended/overridden in subclasses.
			 * @returns {Object|undefined}
			 */
			[GET_REACT_FILE]() {
				const files = this[FILES];
				if (!files) return undefined;
				return files.jsx;
			}

			/**
			 * Get if route is lazy.
			 * Intended to be extended in subclasses.
			 * @returns {boolean|undefined}
			 */
			[GET_IS_LAZY]() { // eslint-disable-line class-methods-use-this
				return undefined;
			}

			/**
			 * Handle request.
			 * Delegates handling to React root.
			 * @param {Object} req - Request object
			 * @returns {Promise|undefined}
			 */
			[handleRouteMethodName](req) {
				// Delegate to super classes
				const res = super[handleRouteMethodName](req);
				if (res !== undefined) return res;

				// If this is React root, return undefined so `plugin-react-root` gets to handle it
				if (this[REACT_ROOT] === this) return undefined;

				// Pass request to React root to handle
				const rootRoute = this[REACT_ROOT];
				if (rootRoute[HANDLE_ROUTE]) return rootRoute[HANDLE_ROUTE](req);
				return rootRoute.handle(req);
			}

			/**
			 * If app is built, delete properties not needed at runtime.
			 * @returns {undefined}
			 */
			async [PRE_BUILD]() {
				if (super[PRE_BUILD]) await super[PRE_BUILD]();
				deleteRouteProperties(this, [REACT_FILE, GET_REACT_FILE, REACT_ROUTER, IS_LAZY, GET_IS_LAZY]);
			}
		};
	}
);
