import PhotoView from './PhotoView';

export default function PhotosView({
  photos,
  height,
  width,
}: {
  photos: any[];
  height?: number;
  width?: number;
}) {
  return (
    <div className='flex gap-2'>
      {photos.map((photo: any) => (
        <PhotoView key={photo.id} photo={photo} height={height} width={width} />
      ))}
    </div>
  );
}
