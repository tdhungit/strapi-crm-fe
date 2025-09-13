import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { App, Upload } from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';

interface MediaFile {
  id: number;
  documentId: string;
  name: string;
  url: string;
  mime: string;
  size: number;
}

interface Props {
  value?: MediaFile | MediaFile[] | string | string[];
  onChange?: (value: MediaFile | MediaFile[] | null) => void;
  options?: {
    multiple?: boolean;
    allowedTypes?: string[];
    maxSize?: number;
    maxCount?: number;
  };
}

export default function MediaUpload({ value, onChange, options = {} }: Props) {
  const { message } = App.useApp();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const {
    multiple = false,
    allowedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx'],
    maxSize = 10,
    maxCount = multiple ? 10 : 1,
  } = options;

  useEffect(() => {
    if (value) {
      const files = Array.isArray(value) ? value : [value];
      const newFileList: UploadFile[] = files
        .filter(Boolean)
        .map((file, index) => {
          if (typeof file === 'string') {
            return {
              uid: `${index}`,
              name: file.split('/').pop() || 'file',
              status: 'done',
              url: file,
            };
          }
          return {
            uid: `${file.id}`,
            name: file.name,
            status: 'done',
            url: file.url,
            response: file,
          };
        });
      setFileList(newFileList);
    } else {
      setFileList([]);
    }
  }, [value]);

  const uploadProps: UploadProps = {
    name: 'files',
    multiple,
    fileList,
    accept: allowedTypes.join(','),
    listType: 'picture',
    beforeUpload: (file) => {
      const isValidSize = file.size / 1024 / 1024 < maxSize;
      if (!isValidSize) {
        message.error(`File must be smaller than ${maxSize}MB!`);
        return Upload.LIST_IGNORE;
      }

      if (fileList.length >= maxCount) {
        message.error(`Maximum ${maxCount} files allowed!`);
        return Upload.LIST_IGNORE;
      }

      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData();
        formData.append('files', file as File);

        const result = await ApiService.request('post', '/upload', formData, {
          'Content-Type': 'multipart/form-data',
        });

        const uploadedFile = Array.isArray(result) ? result[0] : result;

        onSuccess?.(uploadedFile);
        message.success(`${(file as File).name} uploaded successfully`);

        const newFile: UploadFile = {
          uid: `${uploadedFile.id}`,
          name: uploadedFile.name,
          status: 'done',
          url: uploadedFile.url,
          response: uploadedFile,
        };

        const newFileList = [...fileList, newFile];
        setFileList(newFileList);

        if (multiple) {
          const mediaFiles = newFileList
            .filter((f) => f.response)
            .map((f) => f.response as MediaFile);
          onChange?.(mediaFiles);
        } else {
          onChange?.(uploadedFile);
        }
      } catch (error) {
        onError?.(error as Error);
        message.error(`Upload failed: ${(error as Error).message}`);
      }
    },
    onRemove: (file) => {
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(newFileList);

      if (multiple) {
        const mediaFiles = newFileList
          .filter((f) => f.response)
          .map((f) => f.response as MediaFile);
        onChange?.(mediaFiles.length > 0 ? mediaFiles : null);
      } else {
        onChange?.(null);
      }
    },
  };

  return (
    <Upload {...uploadProps}>
      <div
        style={{
          height: '32px',
          padding: '4px 11px',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          textAlign: 'center',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
        }}
      >
        <UploadOutlined style={{ marginRight: '8px' }} />
        Click to upload
      </div>
    </Upload>
  );
}
