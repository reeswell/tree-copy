#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Clipboard } from './clipboard'
import { SimpleTree } from './tree'

interface Args {
  path?: string
  depth?: number
  hidden?: boolean
  copy?: boolean
  ignore?: string[]
}

function parseGitignore(dirPath: string): string[] {
  const gitignorePath = path.join(dirPath, '.gitignore')

  try {
    const content = fs.readFileSync(gitignorePath, 'utf8')
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map((line) => {
        if (line.endsWith('/')) {
          return line.slice(0, -1)
        }
        if (line.startsWith('/')) {
          return line.slice(1)
        }
        return line
      })
  }
  catch {
    return []
  }
}

function parseArgs(): Args {
  const args = process.argv.slice(2)
  const parsed: Args = {
    copy: true, // Default copy enabled
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--help' || arg === '-h') {
      showHelp()
      process.exit(0)
    }
    else if (arg === '--version' || arg === '-v') {
      console.log('1.0.0')
      process.exit(0)
    }
    else if (arg === '--depth' || arg === '-d') {
      parsed.depth = Number.parseInt(args[++i]) || 5
    }
    else if (arg === '--hidden') {
      parsed.hidden = true
    }
    else if (arg === '--copy' || arg === '-c') {
      parsed.copy = true
    }
    else if (arg === '--no-copy') {
      parsed.copy = false
    }
    else if (arg === '--ignore') {
      parsed.ignore = args[++i]?.split(',') || []
    }
    else if (!arg.startsWith('-')) {
      parsed.path = arg
    }
  }

  return parsed
}

function showHelp(): void {
  console.log(`
Usage: tc [path] [options]

Options:
  -d, --depth <number>    Maximum depth (default: 5)
  -c, --copy             Copy output to clipboard (default: enabled)
  --no-copy              Disable clipboard copy
  --hidden               Show hidden files
  --ignore <patterns>    Additional ignore patterns (comma-separated)
  -h, --help             Show help
  -v, --version          Show version

Note: Automatically reads .gitignore file if present

Examples:
  tc                     Copy current directory tree to clipboard
  tc /path/to/dir        Copy specific directory tree
  tc --no-copy           Just display, don't copy
  tc --depth 3           Custom depth with copy
  tc --ignore "*.log,temp" --hidden
`)
}

async function main(): Promise<void> {
  try {
    const args = parseArgs()
    const targetPath = args.path || process.cwd()

    // Read .gitignore file
    const gitignorePatterns = parseGitignore(targetPath)

    const allIgnorePatterns = [
      ...gitignorePatterns,
      ...(args.ignore || []),
    ]

    const tree = new SimpleTree({
      maxDepth: args.depth || 5,
      showHidden: args.hidden || false,
      ignore: allIgnorePatterns,
    })

    const output = tree.generate(targetPath)

    // Show gitignore info if patterns loaded
    if (gitignorePatterns.length > 0) {
      console.log(`📄 Loaded ${gitignorePatterns.length} patterns from .gitignore`)
    }

    console.log(output)

    if (args.copy) {
      try {
        await Clipboard.copy(output)
        console.log('\n📋 Copied to clipboard!')
      }
      catch (error) {
        console.error(`\n❌ Failed to copy: ${(error as Error).message}`)
        console.log('💡 Tip: Use --no-copy to disable clipboard functionality')
      }
    }
  }
  catch (error) {
    console.error(`Error: ${(error as Error).message}`)
    process.exit(1)
  }
}

main()

export { Clipboard, SimpleTree }
