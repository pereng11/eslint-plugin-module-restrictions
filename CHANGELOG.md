# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Support for custom keywords and delimiters
- Additional test coverage for edge cases

### Changed

- Updated documentation with more examples

### Fixed

- Bug fixes and performance improvements

## [0.3.0] - 2025-08-18

### Added

- **New Rules**:
  - `no-deep-import` - When an index file exists, modules within a directory can only be accessed through its index file
  - `avoid-circular-dependency` - Prevents circular dependencies by restricting index file imports within the same module

### Changed

- **Updated package version** - Bumped to version 0.2.2 in package.json
- **Enhanced rule validation** - Improved error handling and validation logic
- **Code optimization** - Better performance for complex directory structures

### Fixed

- **Internal directory logic** - Fixed edge cases in underscore-prefixed directory handling
- **Index file detection** - Improved accuracy of index file existence checks

## [0.2.0] - 2025-08-12

### Added

- **New Rule**:
  - `internal-directory` - Files in underscore-prefixed directories can only be imported from the same level or within the directory
- **Comprehensive test suite** - Added extensive test coverage with Vitest

### Changed

- **Enhanced documentation** - Updated README with detailed examples and usage patterns
- **Code refactoring** - Improved code structure and maintainability

## [0.1.0] - 2025-08-11

### Added

- **Initial release** - First version of eslint-plugin-module-restrictions
- **Core functionality** - Basic import restriction capabilities
- **Three main rules**:
  - `private-module` - Allows imports only from files with same name
  - `same-directory` - Restricts imports to files within the same directory
  - `shared-module` - Allows imports only from files with same prefix
- **Custom validator support** - Allows custom logic for import restrictions via `rule: "custom"`
- **ESLint integration** - Basic plugin structure and rule implementation
- **Basic configuration** - Simple rule configuration options
- **Pattern-based restrictions** - Support for file naming pattern restrictions

### Features

- File naming pattern-based import restrictions
- Flexible rule configuration
- ESLint workflow integration
- Support for various restriction types

---

## Version History

- **0.2.0** - Major feature release with custom validators and enhanced functionality
- **0.1.0** - Initial release with core import restriction features

## Contributing

When contributing to this project, please update this changelog by adding a new entry under the [Unreleased] section. Follow the existing format and include:

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

## Links

- [GitHub Repository](https://github.com/pereng11/eslint-plugin-module-restrictions)
- [NPM Package](https://www.npmjs.com/package/eslint-plugin-module-restrictions)
- [Documentation](https://github.com/pereng11/eslint-plugin-module-restrictions#readme)
