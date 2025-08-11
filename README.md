# ESLint Plugin Module Restrictions

[![npm version](https://badge.fury.io/js/eslint-plugin-module-restrictions.svg)](https://badge.fury.io/js/eslint-plugin-module-restrictions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

An ESLint plugin that restricts module imports based on file naming patterns. This tool helps enforce architectural rules and maintain consistent code structure in your projects. With zero configuration needed!

## ✨ Features

- **File naming pattern-based import restrictions**: Control where files with specific patterns can be imported from
- **Flexible rule configuration**: Support for various restriction rules (same directory, sub-module prefix, same file prefix, custom)
- **ESLint integration**: Seamlessly integrates with existing ESLint workflows
- **TypeScript support**: Full TypeScript support with type definitions

## 📦 Installation

```bash
npm install --save-dev eslint-plugin-module-restrictions
```

## 🚀 Quick Start

### Basic Configuration

```javascript
// .eslintrc.js
module.exports = {
  plugins: ["module-restrictions"],
  extends: ["plugin:module-restrictions/recommended"],
};
```

### Custom Rule Configuration

```javascript
// .eslintrc.js
module.exports = {
  plugins: ["module-restrictions"],
  rules: {
    "module-restrictions/restrict-imports": [
      "error",
      {
        restrictions: [
          {
            pattern: "*.test.ts",
            rule: "same-directory",
            message: "Test files can only import files from the same directory",
          },
          {
            pattern: "*.component.tsx",
            rule: "shared-module",
            message:
              "Component files can only import files with the same prefix",
          },
        ],
      },
    ],
  },
};
```

## 📋 Supported Rules

### `same-directory`

Restricts imports to files within the same directory.

**Example:**

```typescript
// ✅ Allowed
import { helper } from "./helper";

// ❌ Not allowed
import { utils } from "../utils";
```

### `shared-module`

Allows imports only from files that start with the same prefix as the importing file.

**Example:**

```typescript
// File: Box.sub.Icon.tsx
// ✅ Allowed
import { Box } from "./Box.component";
import { BoxHeader } from "./BoxHeader.component";

// ❌ Not allowed
import { Button } from "./Button.component";
```

### `private-module`

Restricts imports to files that share the same file prefix.

**Example:**

```typescript
// File: user.service.ts
// ✅ Allowed
import { UserRepository } from "./user.repository";
import { UserModel } from "./user.model";

// ❌ Not allowed
import { AuthService } from "./auth.service";
```

### `internal-directory`

Restricts imports from files in underscore-prefixed directories (`_*`) to only allow imports from the same level directory or within the underscore directory itself.

**Example:**

```typescript
// File structure:
// src/
// ├── _utils/
// │   ├── helper.ts
// │   └── validator.ts
// ├── components/
// │   ├── Button.ts
// │   └── _internal/
// │       └── helper.ts
// └── pages/
//     └── Home.ts

// ✅ Allowed - same level directory
// From: src/components/Button.ts
import { helper } from "../../_utils/helper";

// ✅ Allowed - within underscore directory
// From: src/_utils/validator.ts
import { helper } from "./helper";

// ✅ Allowed - nested within underscore directory
// From: src/_utils/nested/processor.ts
import { helper } from "../helper";

// ✅ Allowed - same level underscore directories
// From: src/_components/Button.ts
import { helper } from "../_utils/helper";

// ❌ Not allowed - different parent directory
// From: src/pages/Home.ts
import { helper } from "../_utils/helper";

// ❌ Not allowed - deeply nested to different level
// From: src/pages/nested/Home.ts
import { helper } from "../../components/_internal/helper";
```

### `custom`

Allows custom logic for import restrictions.

**Example:**

```javascript
{
  pattern: "*.api.ts",
  rule: "custom",
  validator: (importPath, filePath) => {
    // Custom validation logic
    return importPath.includes('/api/');
  },
  message: "API files can only import from API directories"
}
```

## 🛠️ Development

### Prerequisites

- Node.js >= 16
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/eslint-plugin-module-restrictions.git
cd eslint-plugin-module-restrictions

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Available Scripts

- `npm run build` - Build the TypeScript code
- `npm run test` - Run tests with Vitest
- `npm run typecheck` - Type check without emitting files
- `npm run clean` - Clean build artifacts

## 🤝 Contributing

We welcome bug reports, feature requests, and pull requests!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and add tests
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Feature Requests & Bug Reports**: [GitHub Issues](https://github.com/your-username/eslint-plugin-module-restrictions/issues)

## 🙏 Acknowledgments

Thanks to all contributors who have helped make this project better!

---

**Made with ❤️ by the ESLint Plugin Module Restrictions team**
