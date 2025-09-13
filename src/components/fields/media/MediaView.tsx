export default function MediaView({
  value,
}: {
  value: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    mime: string;
    size: number;
  };
}) {
  return (
    <div>
      {value.mime && value.mime.startsWith('image/') ? (
        <img
          src={import.meta.env.VITE_MEDIA_URL + value.url}
          alt={value.name}
          style={{ maxWidth: '100%', maxHeight: 32 }}
        />
      ) : (
        <a href={import.meta.env.VITE_MEDIA_URL + value.url}>{value.name}</a>
      )}
    </div>
  );
}
