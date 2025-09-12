import { Rate } from 'antd';

export default function RankingView({
  value,
  fontSize = 20,
}: {
  value: number;
  fontSize?: number;
}) {
  return (
    <Rate
      count={5}
      value={value}
      disabled
      allowHalf={false}
      allowClear={true}
      style={{ fontSize }}
    />
  );
}
