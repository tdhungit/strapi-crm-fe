interface Props {
  value?: {
    country?: string;
    state?: string;
    city?: string;
    zipcode?: string;
    address?: string;
  };
}

export default function AddressView(props: Props) {
  return (
    <div>
      {`${props.value?.address}, ${props.value?.city}, ${props.value?.state}, ${props.value?.country}, ${props.value?.zipcode}`}
    </div>
  );
}
