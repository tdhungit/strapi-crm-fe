import { Image } from 'antd';

export default function PhotoView({
  photo,
  width,
  height,
}: {
  photo: any;
  width?: number;
  height?: number;
}) {
  return (
    <div>
      <Image
        src={
          photo.url.startsWith('http')
            ? photo.url
            : import.meta.env.VITE_MEDIA_URL + photo.url
        }
        alt={photo.name}
        width={width || 80}
        height={height || 80}
      />
    </div>
  );
}
