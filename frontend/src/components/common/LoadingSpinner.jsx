import { Spin } from 'antd';

/**
 * Centered full-area loading spinner.
 * Props: height (default 300)
 */
export default function LoadingSpinner({ height = 300 }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height,
      }}
    >
      <Spin size="large" />
    </div>
  );
}
