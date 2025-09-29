import { Carousel } from 'antd';
import { getMediaUrl } from '../../../helpers/views_helper';

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

export default function PhotosCarousel({
  photos,
  height,
  width,
  itemStyle,
}: {
  photos: any[];
  height?: any;
  width?: any;
  itemStyle?: any;
}) {
  return (
    <div>
      <Carousel
        arrows
        infinite={true}
        autoplay={{ dotDuration: true }}
        autoplaySpeed={5000}
      >
        {photos?.length > 0 &&
          photos.map((photo: any) => (
            <div>
              <img
                src={getMediaUrl(photo)}
                alt={photo.name}
                style={itemStyle || contentStyle}
                width={width || 80}
                height={height || 80}
              />
            </div>
          ))}
      </Carousel>
    </div>
  );
}
