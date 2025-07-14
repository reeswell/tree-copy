import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

export interface TreeOptions {
  maxDepth?: number
  showHidden?: boolean
  ignore?: string[]
}

export class SimpleTree {
  private options: TreeOptions

  constructor(options: TreeOptions = {}) {
    this.options = {
      maxDepth: 5,
      showHidden: false,
      ignore: ['node_modules', '.git', 'dist', 'build', '.DS_Store'],
      ...options,
    }
  }

  generate(dirPath: string = process.cwd()): string {
    const projectName = path.basename(dirPath)
    const tree = this.buildTree(dirPath)
    return `${projectName}/\n${tree}`
  }

  private buildTree(dir: string, prefix = '', depth = 0): string {
    if (depth >= this.options.maxDepth!)
      return ''

    let items: string[] = []
    try {
      items = fs.readdirSync(dir).filter(item => this.shouldInclude(item))
    }
    catch {
      return ''
    }

    // Sort: directories first, then alphabetically
    items.sort((a, b) => {
      const aPath = path.join(dir, a)
      const bPath = path.join(dir, b)
      const aIsDir = this.isDirectory(aPath)
      const bIsDir = this.isDirectory(bPath)

      if (aIsDir && !bIsDir)
        return -1
      if (!aIsDir && bIsDir)
        return 1
      return a.localeCompare(b)
    })

    let result = ''
    items.forEach((item, index) => {
      const isLast = index === items.length - 1
      const symbol = isLast ? '└── ' : '├── '
      const nextPrefix = prefix + (isLast ? '    ' : '│   ')

      const itemPath = path.join(dir, item)
      const displayName = this.isDirectory(itemPath) ? `${item}/` : item

      result += `${prefix}${symbol}${displayName}\n`

      if (this.isDirectory(itemPath)) {
        result += this.buildTree(itemPath, nextPrefix, depth + 1)
      }
    })

    return result
  }

  private shouldInclude(item: string): boolean {
    // Check hidden files
    if (!this.options.showHidden && item.startsWith('.')) {
      return false
    }

    // Check ignore patterns
    for (const pattern of this.options.ignore || []) {
      if (this.matchPattern(item, pattern)) {
        return false
      }
    }

    return true
  }

  private matchPattern(item: string, pattern: string): boolean {
    // Exact match
    if (item === pattern) {
      return true
    }

    // Wildcard pattern matching
    if (pattern.includes('*')) {
      const regex = new RegExp(
        `^${pattern.replace(/\*/g, '.*').replace(/\?/g, '.')}$`,
      )
      return regex.test(item)
    }

    // File extension matching (e.g., *.log)
    if (pattern.startsWith('*.')) {
      const ext = pattern.slice(1) // Remove *
      return item.endsWith(ext)
    }

    // Partial match
    return item.includes(pattern)
  }

  private isDirectory(filePath: string): boolean {
    try {
      return fs.statSync(filePath).isDirectory()
    }
    catch {
      return false
    }
  }
}
