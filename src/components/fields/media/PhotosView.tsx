import PhotoView from './PhotoView';

export default function PhotosView({
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
    <div className='flex gap-2'>
      {photos.map((photo: any) => (
        <PhotoView
          key={photo.id}
          photo={photo}
          height={height}
          width={width}
          style={itemStyle}
        />
      ))}
    </div>
  );
}
