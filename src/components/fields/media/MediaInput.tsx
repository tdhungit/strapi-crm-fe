import { CloseOutlined, FileOutlined, SelectOutlined } from '@ant-design/icons';
import { Button, Image, List } from 'antd';
import { useEffect, useState } from 'react';
import MediaManagerModal from '../../MediaManagerModal';

interface MediaFile {
  id?: number;
  documentId?: string;
  name?: string;
  url?: string;
  mime?: string;
  size?: number;
}

interface Props {
  value?: MediaFile | MediaFile[];
  onChange?: (value: MediaFile | MediaFile[] | null) => void;
  options?: {
    multiple?: boolean;
    allowedTypes?: string[];
    maxSize?: number;
    maxCount?: number;
  };
}

export default function MediaInput({
  value: defaultValue,
  options,
  onChange,
}: Props) {
  const [value, setValue] = useState<MediaFile | MediaFile[] | null>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const { multiple = false } = options || {};

  // Normalize value to array for consistent handling
  const normalizedValue = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelectMedia = (media: MediaFile | MediaFile[]) => {
    if (multiple) {
      const multiValue = Array.isArray(media) ? media : [media];
      setValue([...normalizedValue, ...multiValue]);
      onChange?.([...normalizedValue, ...multiValue]);
      return;
    }

    setValue(media);
    onChange?.(media);
  };

  return (
    <>
      <Button type='default' onClick={() => setOpen(true)}>
        <SelectOutlined /> Select Media
      </Button>

      {normalizedValue.length > 0 && (
        <List
          itemLayout='horizontal'
          size='small'
          bordered
          dataSource={normalizedValue}
          style={{ marginTop: 16 }}
          renderItem={(item) => {
            return (
              <List.Item
                key={item.id}
                actions={[
                  <Button
                    type='link'
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setValue(null);
                      onChange?.(null);
                    }}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    item.mime?.startsWith('image/') ? (
                      <Image
                        src={import.meta.env.VITE_MEDIA_URL + item.url}
                        height={32}
                      />
                    ) : (
                      <FileOutlined height={32} />
                    )
                  }
                  title={item.name}
                  description={item.mime}
                />
              </List.Item>
            );
          }}
        />
      )}

      <MediaManagerModal
        open={open}
        onOpenChange={setOpen}
        onSelect={handleSelectMedia}
      />
    </>
  );
}
