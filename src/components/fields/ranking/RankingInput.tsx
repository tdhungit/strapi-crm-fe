import { Rate } from 'antd';

export default function RankingInput({
  value,
  onChange,
  fontSize = 20,
}: {
  value?: number;
  fontSize?: number;
  onChange?: (value: number) => void;
}) {
  return (
    <Rate
      count={5}
      value={value}
      onChange={onChange}
      allowHalf={false}
      allowClear={true}
      style={{ fontSize }}
    />
  );
}
