import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Image } from 'antd';
import { useEffect, useState } from 'react';
import MediaManagerModal from '../../MediaManagerModal';

export default function MediaChoose({
  value: defaultValue,
  onChange,
}: {
  value?: any;
  onChange?: (value: any) => void;
}) {
  const [value, setValue] = useState<any>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (media: any) => {
    let newValue = value;
    if (Array.isArray(media)) {
      newValue = [...value, ...media];
    } else {
      newValue = [...value, media];
    }
    setValue(newValue);
    onChange?.(newValue);
  };

  const getUrlMedia = (media: any) => {
    if (media.url.startsWith('http')) {
      return media.url;
    }
    return import.meta.env.VITE_MEDIA_URL + media.url;
  };

  return (
    <>
      <div className='w-full flex justify-start items-start gap-1'>
        <Button
          variant='dashed'
          color='cyan'
          style={{ width: 80, height: 80 }}
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        />

        {value?.length > 0 &&
          value.map((item: any) => (
            <div
              key={item.id || item.url}
              className='relative'
              style={{ width: 80, height: 80 }}
            >
              <Image
                key={item.id}
                src={getUrlMedia(item)}
                width='100%'
                height='100%'
              />
              <div
                className='absolute top-[-10px] right-[-5px] cursor-pointer text-red-500'
                onClick={() => {
                  setValue(value.filter((v: any) => v.id !== item.id));
                  onChange?.(value.filter((v: any) => v.id !== item.id));
                }}
              >
                <CloseCircleFilled />
              </div>
            </div>
          ))}
      </div>

      <MediaManagerModal
        open={open}
        onOpenChange={setOpen}
        onSelect={handleChange}
      />
    </>
  );
}
