interface PageErrorProps {
  message: string;
}

export default function PageError({ message }: PageErrorProps) {
  return (
    <div className='text-center w-full h-full flex justify-center items-center text-red-500'>
      {message}
    </div>
  );
}
