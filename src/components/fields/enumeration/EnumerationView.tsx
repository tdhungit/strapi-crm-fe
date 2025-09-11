interface Props {
  type: any;
  value: string;
}

export default function EnumerationView(props: Props) {
  const { type } = props;
  const options = type?.enum || [];
  const value = props.value;
  const label = options.find((option: any) => option === value);
  return <>{label || props.value}</>;
}
