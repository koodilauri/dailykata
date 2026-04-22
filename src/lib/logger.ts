import { createConsola } from 'consola'

const levelMap: Record<string, number> = {
  silent: -999,
  error: 0,
  warn: 1,
  info: 3,
  debug: 4,
  trace: 5
}

export const logger = createConsola({
  level: levelMap[process.env.LOG_LEVEL ?? 'info'] ?? 3
})
