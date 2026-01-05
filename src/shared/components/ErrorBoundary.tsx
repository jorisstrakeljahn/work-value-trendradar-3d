import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import i18n from '../../i18n/config'
import { Button } from './ui'
import { logErrorWithContext } from '../utils/errorLogger'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  domain?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * React Error Boundary component for catching and handling errors
 * Provides domain-specific error handling and fallback UI
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logErrorWithContext(
      error,
      this.props.domain || 'ErrorBoundary',
      'componentDidCatch',
      {
        componentStack: errorInfo.componentStack,
      }
    )
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const errorTitle = this.props.domain
        ? i18n.t('errors.domainError', { domain: this.props.domain })
        : i18n.t('errors.genericError')
      const tryAgainText = i18n.t('errors.tryAgain')

      return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[200px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400 mb-4" />
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            {errorTitle}
          </h2>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <p className="text-sm text-red-700 dark:text-red-300 mb-4 text-center max-w-md">
              {this.state.error.message}
            </p>
          )}
          <Button onClick={this.handleReset} variant="primary">
            {tryAgainText}
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
