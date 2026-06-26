import { Tag } from 'antd';

const CATEGORY_COLORS = {
  Electronics: 'blue',
  Clothing: 'purple',
  'Food & Beverage': 'green',
  Furniture: 'orange',
  Books: 'cyan',
  Sports: 'red',
  Other: 'default',
};

/**
 * Colored tag for a product category.
 * Props: category (string)
 */
export default function CategoryTag({ category }) {
  return (
    <Tag color={CATEGORY_COLORS[category] || 'default'} style={{ margin: 0 }}>
      {category}
    </Tag>
  );
}

export { CATEGORY_COLORS };
