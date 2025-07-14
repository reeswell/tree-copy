import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SimpleTree } from '../src/tree'

describe('simpleTree', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'))
  })

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  it('should generate basic tree', () => {
    fs.writeFileSync(path.join(tempDir, 'file.txt'), 'test')
    fs.mkdirSync(path.join(tempDir, 'folder'))

    const tree = new SimpleTree()
    const result = tree.generate(tempDir)

    expect(result).toContain('file.txt')
    expect(result).toContain('folder/')
  })

  it('should respect maxDepth', () => {
    fs.mkdirSync(path.join(tempDir, 'level1'))
    fs.mkdirSync(path.join(tempDir, 'level1', 'level2'))
    fs.writeFileSync(path.join(tempDir, 'level1', 'level2', 'deep.txt'), 'test')

    const tree = new SimpleTree({ maxDepth: 1 })
    const result = tree.generate(tempDir)

    expect(result).toContain('level1/')
    expect(result).not.toContain('deep.txt')
  })

  it('should ignore specified patterns', () => {
    fs.mkdirSync(path.join(tempDir, 'node_modules'))
    fs.writeFileSync(path.join(tempDir, 'app.js'), 'js')

    const tree = new SimpleTree()
    const result = tree.generate(tempDir)

    expect(result).not.toContain('node_modules')
    expect(result).toContain('app.js')
  })

  it('should handle wildcard patterns', () => {
    fs.writeFileSync(path.join(tempDir, 'app.log'), 'log')
    fs.writeFileSync(path.join(tempDir, 'error.log'), 'error')
    fs.writeFileSync(path.join(tempDir, 'app.js'), 'js')

    const tree = new SimpleTree({ ignore: ['*.log'] })
    const result = tree.generate(tempDir)

    expect(result).not.toContain('app.log')
    expect(result).not.toContain('error.log')
    expect(result).toContain('app.js')
  })

  it('should show hidden files when enabled', () => {
    fs.writeFileSync(path.join(tempDir, '.hidden'), 'hidden')
    fs.writeFileSync(path.join(tempDir, 'visible.txt'), 'visible')

    const tree = new SimpleTree()
    const result = tree.generate(tempDir)
    expect(result).not.toContain('.hidden')
    expect(result).toContain('visible.txt')

    const treeWithHidden = new SimpleTree({ showHidden: true })
    const resultWithHidden = treeWithHidden.generate(tempDir)
    expect(resultWithHidden).toContain('.hidden')
    expect(resultWithHidden).toContain('visible.txt')
  })
})
