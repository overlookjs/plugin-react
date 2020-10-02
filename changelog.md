# Changelog

## 0.2.1

Bug fixes:

* Init `[IS_LAZY]` prop
* Fix bug in handling
* Fix determining router route
* Router mandatory if not React root
* Determine `[IS_LAZY]` even if no router
* Only add to router if file present

Performance:

* Delete more properties in build

Refactor:

* Shorten determining React root

No code:

* Code comment

Tests:

* Add tests

## 0.2.0

Breaking changes:

* Change `[REACT_ROUTER_ADD_ROUTE]` args
* Rename `[ROUTER_ADD_ROUTE]` method

Features:

* `[IS_LAZY]` to specify if route is lazy or not

Refactor:

* Remove unnecessary checking for self as root

## 0.1.0

Breaking changes:

* Re-write

## 0.0.1

* Initial release
