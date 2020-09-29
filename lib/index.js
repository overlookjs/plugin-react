/* --------------------
 * @overlook/plugin-react module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	{INIT_PROPS, INIT_ROUTE} = require('@overlook/route'),
	{FILES} = require('@overlook/plugin-load'),
	{URL_PATH, HANDLE_ROUTE} = require('@overlook/plugin-path'),
	{findParentOrSelf} = require('@overlook/util-find-parent');

// Imports
const pkg = require('../package.json');

// Exports

module.exports = new Plugin(
	pkg,
	{symbols: ['REACT_FILE', 'GET_REACT_FILE', 'REACT_ROOT']},
	extend
);

// Import after export to avoid circular `require()`s, as these plugins extend this one.
// const {GET_REACT_ROOT_FILE} = require('@overlook/plugin-react-root'),
// {ADD_ROUTE} = require('@overlook/plugin-react-router');
// TODO Replace these once other plugins created
const ADD_ROUTE = Symbol('@overlook/plugin-react-root.ADD_ROUTE'),
	GET_REACT_ROOT_FILE = Symbol('@overlook/plugin-react-router.GET_REACT_ROOT_FILE');

function extend(Route, {REACT_FILE, GET_REACT_FILE, REACT_ROOT}) {
	// Extend `[HANDLE_ROUTE]()` if defined, otherwise extend `handle()`
	const handleRouteMethodName = Route.prototype[HANDLE_ROUTE] ? HANDLE_ROUTE : 'handle';

	return class ReactRoute extends Route {
		[INIT_PROPS](props) {
			super[INIT_PROPS](props);
			this[REACT_FILE] = undefined;
		}

		async [INIT_ROUTE]() {
			await super[INIT_ROUTE]();

			// Init React file
			let file = this[REACT_FILE];
			if (!file) {
				file = this[GET_REACT_FILE]();
				if (file) this[REACT_FILE] = file;
			}

			// Locate React root above
			let rootRoute;
			if (this[GET_REACT_ROOT_FILE]) {
				rootRoute = this;
			} else {
				const parentRoute = findParentOrSelf(route => route[REACT_ROOT]);
				if (parentRoute) rootRoute = parentRoute[REACT_ROOT];
			}
			this[REACT_ROOT] = rootRoute;

			// Locate React router above
			if (rootRoute !== this) {
				const routerRoute = findParentOrSelf(route => route[ADD_ROUTE]);
				if (routerRoute) routerRoute[ADD_ROUTE](file, this[URL_PATH]);
			}
		}

		[GET_REACT_FILE]() {
			const files = this[FILES];
			if (!files) return undefined;
			return files.jsx;
		}

		[handleRouteMethodName](req) {
			// Delegate to super classes
			const res = super[handleRouteMethodName](req);
			if (!res !== undefined) return res;

			// Pass request to React root to handle
			const rootRoute = this[REACT_ROOT];
			if (!rootRoute) return undefined;
			return rootRoute[handleRouteMethodName](req);
		}
	};
}
