import { RevenueTag as RevenueTagType } from '@/lib/types';
import { REVENUE_CONFIG } from '@/lib/constants';
import Badge from '../ui/Badge';

interface RevenueTagProps {
  tag: RevenueTagType;
}

export default function RevenueTag({ tag }: RevenueTagProps) {
  const config = REVENUE_CONFIG[tag];
  return (
    <Badge color={config.color} bg={config.bg}>
      {config.label}
    </Badge>
  );
}
