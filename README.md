# ESLint Plugin Module Restrictions

[![npm version](https://badge.fury.io/js/eslint-plugin-module-restrictions.svg)](https://badge.fury.io/js/eslint-plugin-module-restrictions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

An ESLint plugin that restricts module imports based on file naming patterns. This tool helps enforce architectural rules and maintain consistent code structure in your projects. **With zero configuration needed**!

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

### `private-module`

Private modules can only be imported by files with same parent name.

**Example:**

```typescript
// File: Modal.private.Header.tsx
// ✅ Allowed
// From: src/components/Modal/Modal.tsx
import { ModalHeader } from "./Modal.private.Header";

// ❌ Not allowed
// From: src/components/Box/Box.tsx
import { ModalHeader } from "./Modal.private.Header";

// ❌ Not allowed
// From: src/components/Modal/ModalContent.tsx
import { ModalHeader } from "./Modal.private.Header";
```

### `shared-module`

Allows imports only from files that start with the same prefix as the importing file.

**Example:**

```typescript
// File: Box.sub.Icon.tsx
// ✅ Allowed
// From: src/components/Box/Box.tsx
import { BoxIcon } from "./Box.sub.Icon";

// ✅ Allowed
// From: src/components/Box/BoxHeader.tsx
import { BoxIcon } from "./Box.sub.Icon";

// ❌ Not allowed
// From: src/components/Button/Button.tsx
import { BoxIcon } from "./Box.sub.Icon";
```

### `internal-directory`

Restricts imports from files in underscore-prefixed directories (`_*`) to only allow imports from the same level directory or within the underscore directory itself.

**Example:**

```typescript
// File structure:
// src/
// ├── _shared/
// │   ├── api-client.ts
// │   ├── constants.ts
// │   └── types.ts
// ├── components/
// │   ├── Button/
// │   │   ├── Button.tsx
// │   │   └── _internal/
// │   │       ├── button-styles.ts
// │   │       └── button-utils.ts
// │   └── Modal/
// │       ├── Modal.tsx
// │       └── _internal/
// │           └── modal-hooks.ts
// ├── pages/
// │   ├── Home/
// │   │   └── HomePage.tsx
// │   └── Profile/
// │       └── ProfilePage.tsx
// └── hooks/
//     └── useAuth.ts

// ✅ Allowed - same level directory
// From: src/pages/Home/HomePage.tsx
import { API_BASE_URL } from "../../_shared/constants";

// ✅ Allowed - same level directory
// From: src/components/Button/Button.tsx
import { API_BASE_URL } from "../../_shared/constants";

// ✅ Allowed - within underscore directory
// From: src/_shared/api-client.ts
import { API_BASE_URL } from "./constants";
import { ApiResponse } from "./types";

// ✅ Allowed - within underscore directory
// From: src/components/Button/_internal/button-utils.ts
import { buttonStyles } from "./button-styles";

// ❌ Not allowed - different parent directory
// From: src/components/Modal/Modal.tsx
import { buttonUtils } from "../Button/_internal/button-utils";

// ❌ Not allowed - accessing from parent directories above
// From: src/App.tsx
import { buttonStyles } from "../../components/Button/_internal/button-styles";
```

### `no-deep-import`

When an index file exists, modules within a directory can only be accessed through its index file. This promotes better encapsulation and cleaner import statements.

**Example:**

```typescript
// File structure:
// src/
// ├── components/
// │   ├── index.ts          // ✅ Exists - exports all components
// │   ├── Button.ts
// │   ├── Input.ts
// │   └── Modal.ts
// ├── utils/
// │   ├── index.ts          // ✅ Exists - exports all utilities
// │   ├── formatter.ts
// │   └── validator.ts
// └── pages/
//     ├── Home.ts
//     └── Profile.ts

// ✅ Allowed - importing through index file
// From: src/pages/Home.ts
import { Button, Input, Modal } from "../components";
import { formatter, validator } from "../utils";

// ❌ Not allowed - direct deep import when index exists
// From: src/pages/Home.ts
import { Button } from "../components/Button";
import { formatter } from "../utils/formatter";

// ✅ Allowed - direct import when no index file exists
// From: src/App.tsx
import { Home } from "./pages/Home.ts"; // No index.ts in pages/
```

### `avoid-circular-dependency`

Prevents circular dependencies by restricting index file imports within the same module. This helps maintain clean architecture and prevents runtime issues.

**Example:**

```typescript
// File structure:
// src/
// ├── features/
// │   ├── index.ts // Exports all modules in features
// │   ├── user/
// │   │   ├── index.ts      // Exports user components
// │   │   ├── UserProfile.ts
// │   │   ├── UserSettings.ts
// │   │   └── UserService.ts
// │   └── shared/
// │       ├── index.ts      // Exports shared utilities
// │       ├── constants.ts
// │       └── helpers.ts

// ✅ Allowed - importing from different modules
// From: src/features/user/UserProfile.ts
import { constants } from "../shared";

// ✅ Allowed - importing specific files within same module
// From: src/features/user/UserProfile.ts
import { UserService } from "./UserService";

// ❌ Not allowed - importing through index in same directory
// From: src/features/user/UserProfile.ts
import { UserService } from "./index"; // Circular dependency risk

// ❌ Not allowed - importing through index in common parent directory
// From: src/features/user/UserProfile.ts
import { helperA } from "../index"; // Circular dependency risk
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

- **Feature Requests & Bug Reports**: [GitHub Issues](https://github.com/pereng11/eslint-plugin-module-restrictions/issues)

## 🙏 Acknowledgments

Thanks to all contributors who have helped make this project better!

---

**Made with ❤️ by the ESLint Plugin Module Restrictions team**
