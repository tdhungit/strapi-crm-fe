import dayjs from 'dayjs';

export default function DateTimeView({ value }: { value: string }) {
  return <div>{dayjs(value).format('DD/MM/YYYY HH:mm')}</div>;
}
