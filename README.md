# Tree-copy

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

description

A simple and fast directory tree generator with clipboard support and automatic .gitignore integration.

## Features

- 📋 **Default clipboard copy** - Automatically copies output to clipboard
- 🔍 **Smart .gitignore integration** - Respects your project's .gitignore patterns
- 🌳 **Clean tree visualization** - Beautiful directory structure display
- ⚡ **Fast and lightweight** - Minimal dependencies, maximum performance
- 🎯 **Flexible filtering** - Custom ignore patterns and depth control

## Installation

```bash
# Install globally
npm install -g tree-copy

# Or use with npx
npx tree-copy
```

## Basic Usage

```bash
# Generate and copy current directory tree (default behavior)
tc

# Generate tree for specific directory
tc /path/to/directory

# Just display without copying
tc --no-copy
```

## Advanced Options

```bash
# Set maximum depth
tc --depth 3
tc -d 5

# Show hidden files
tc --hidden

# Additional ignore patterns (beyond .gitignore)
tc --ignore "*.log,temp,cache"

# Combine multiple options
tc --depth 3 --hidden --ignore "*.tmp"
```

## Command Aliases

| Command | Description |
|---------|-------------|
| `tree-copy` | Full command name |
| `tc`  | Short alias (recommended) |

## Examples

```bash
# Quick copy current directory structure (most common usage)
tc

# Analyze specific project with custom depth
tc ~/my-project --depth 4

# Show all files including hidden ones
tc --hidden

# Display only without copying to clipboard
tc --no-copy

# Custom ignore patterns in addition to .gitignore
tc --ignore "*.tmp,cache,logs"
```

## Options Reference

**Usage:** `tc [path] [options]`

### Arguments

| Argument | Description |
|----------|-------------|
| `path` | Directory path to analyze (default: current directory) |

### Options

| Option | Description |
|--------|-------------|
| `-c, --copy` | Copy output to clipboard (default: enabled) |
| `--no-copy` | Disable clipboard copy |
| `-d, --depth <number>` | Maximum depth to traverse (default: 5) |
| `--hidden` | Show hidden files and directories |
| `--ignore <patterns>` | Additional ignore patterns (comma-separated) |
| `-h, --help` | Display help information |
| `-v, --version` | Display version number |

> **Note:** Automatically reads .gitignore file if present

## Sample Output

```text
my-project/
├── package.json
├── README.md
├── src/
│   ├── index.ts
│   ├── components/
│   │   ├── App.tsx
│   │   └── Header.tsx
│   └── utils/
│       └── helpers.ts
├── tests/
│   └── app.test.ts
└── dist/
    └── index.js
```

📋 Copied to clipboard!

## Smart .gitignore Integration

The tool automatically reads and respects your project's `.gitignore` file:

- **Automatic detection** - Finds `.gitignore` in the target directory
- **Pattern matching** - Supports wildcards (`*.log`), directories (`dist/`), etc.
- **Layered filtering** - Combines default patterns + .gitignore + custom `--ignore` patterns
- **No configuration needed** - Works out of the box with existing projects

## Platform Support

Clipboard Requirements

- **macOS** - `pbcopy` (built-in)
- **Windows** - `clip` (built-in)
- **Linux** - Install `xclip` or `xsel`

```bash
# Ubuntu/Debian
sudo apt-get install xclip

# Fedora/RHEL
sudo dnf install xclip

# Arch Linux
sudo pacman -S xclip
```

## Tips

Tips

- Use `tc` for the quickest way to copy directory structure
- The tool respects your project's .gitignore automatically
- Use `--no-copy` if you only want to display the tree
- Use `--depth` to limit output for large projects
- Combine with other commands: `tc && echo "Tree copied!"`

[npm-version-src]: https://img.shields.io/npm/v/tree-copy?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/tree-copy

[npm-downloads-src]: https://img.shields.io/npm/dm/tree-copy?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/tree-copy

[bundle-src]: https://img.shields.io/bundlephobia/minzip/tree-copy?style=flat&colorA=18181B&colorB=28CF8D
[bundle-href]: https://bundlephobia.com/result?p=tree-copy

[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=18181B&colorB=28CF8D
[jsdocs-href]: https://www.jsdocs.io/package/tree-copy

[license-src]: https://img.shields.io/github/license/reeswell/tree-copy.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://github.com/reeswell/tree-copy/blob/main/LICENSE
