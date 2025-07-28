type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: string
  context?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logs: LogEntry[] = []

  private createLogEntry(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context
    }
  }

  private log(level: LogLevel, message: string, data?: any, context?: string) {
    const entry = this.createLogEntry(level, message, data, context)
    
    // Armazenar log para debug
    this.logs.push(entry)
    
    // Manter apenas os últimos 100 logs
    if (this.logs.length > 100) {
      this.logs.shift()
    }

    // Só imprimir no console em desenvolvimento
    if (this.isDevelopment) {
      const contextStr = context ? `[${context}] ` : ''
      const logMessage = `${contextStr}${message}`
      
      switch (level) {
        case 'debug':
          console.log(`🔍 ${logMessage}`, data)
          break
        case 'info':
          console.info(`ℹ️ ${logMessage}`, data)
          break
        case 'warn':
          console.warn(`⚠️ ${logMessage}`, data)
          break
        case 'error':
          console.error(`❌ ${logMessage}`, data)
          break
      }
    }
  }

  debug(message: string, data?: any, context?: string) {
    this.log('debug', message, data, context)
  }

  info(message: string, data?: any, context?: string) {
    this.log('info', message, data, context)
  }

  warn(message: string, data?: any, context?: string) {
    this.log('warn', message, data, context)
  }

  error(message: string, data?: any, context?: string) {
    this.log('error', message, data, context)
  }

  // Método para obter logs (útil para debug)
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return [...this.logs]
  }

  // Método para limpar logs
  clearLogs() {
    this.logs = []
  }
}

// Instância singleton
export const logger = new Logger()

// Aliases para facilitar migração
export const log = logger.info.bind(logger)
export const logError = logger.error.bind(logger)
export const logWarn = logger.warn.bind(logger)
export const logDebug = logger.debug.bind(logger) 