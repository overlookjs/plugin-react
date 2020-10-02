/* --------------------
 * @overlook/plugin-react module
 * ESM entry point
 * Re-export CJS with named exports
 * ------------------*/

// Exports

import reactPlugin from '../lib/index.js';

export default reactPlugin;
export const {
	REACT_FILE,
	GET_REACT_FILE,
	REACT_ROOT,
	REACT_ROUTER,
	ROUTER_ADD_ROUTE,
	IS_LAZY,
	GET_IS_LAZY
} = reactPlugin;
