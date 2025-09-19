import { Image } from 'antd';
import { getMediaUrl } from '../../../helpers/views_helper';

export default function PhotoView({
  photo,
  width,
  height,
  style,
}: {
  photo: any;
  width?: any;
  height?: any;
  style?: any;
}) {
  return (
    <div>
      <Image
        src={getMediaUrl(photo)}
        alt={photo.name}
        width={width || 80}
        height={height || 80}
        style={style}
      />
    </div>
  );
}
