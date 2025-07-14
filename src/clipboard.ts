import { spawn } from 'node:child_process'
import process from 'node:process'

export class Clipboard {
  static async copy(text: string): Promise<void> {
    const platform = process.platform

    try {
      if (platform === 'darwin') {
        await this.exec('pbcopy', text)
      }
      else if (platform === 'win32') {
        await this.exec('clip', text)
      }
      else {
        // Try xclip first, then xsel
        try {
          await this.exec('xclip -selection clipboard', text)
        }
        catch {
          await this.exec('xsel --clipboard --input', text)
        }
      }
    }
    catch (error) {
      throw new Error(`Failed to copy to clipboard: ${(error as Error).message}`)
    }
  }

  private static exec(command: string, input: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ')
      const child = spawn(cmd, args, { stdio: ['pipe', 'ignore', 'pipe'] })

      child.on('error', reject)
      child.on('close', (code) => {
        code === 0 ? resolve() : reject(new Error(`Command failed: ${command}`))
      })

      child.stdin.write(input)
      child.stdin.end()
    })
  }
}
