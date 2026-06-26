import { Alert } from 'antd';

/**
 * Reusable error display alert.
 * Props: message, onRetry (optional retry button)
 */
export default function ErrorAlert({ message, onRetry }) {
  return (
    <Alert
      type="error"
      message={message || 'Something went wrong. Please try again.'}
      showIcon
      action={
        onRetry
          ? <span onClick={onRetry} style={{ cursor: 'pointer', color: '#1677ff', fontWeight: 500 }}>Retry</span>
          : undefined
      }
    />
  );
}
