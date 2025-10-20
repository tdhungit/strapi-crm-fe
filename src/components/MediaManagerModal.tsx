import {
  CheckCircleOutlined,
  FileOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  SelectOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Image,
  Input,
  Modal,
  Pagination,
  Row,
  Spin,
  Typography,
  Upload,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../services/ApiService';

const { Text } = Typography;

interface MediaItem {
  id: number;
  name: string;
  url: string;
  mime: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  metadata: {
    pagination: {
      page: number;
      pageSize: number;
      total: number;
    };
  };
}

export default function MediaManagerModal({
  open,
  onOpenChange,
  onSelect,
  multiple,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (media: MediaItem | MediaItem[]) => void;
  multiple?: boolean;
}) {
  const [medias, setMedias] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedMediaList, setSelectedMediaList] = useState<MediaItem[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [externalUrl, setExternalUrl] = useState('');

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const fetchMedias = async (page = 1, pageSize = 12) => {
    setLoading(true);
    try {
      const response: MediaResponse = await ApiService.request(
        'get',
        '/medias',
        {
          page,
          pageSize,
        }
      );

      setMedias(response.data || []);
      setPagination({
        current: page,
        pageSize,
        total: response.metadata?.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch medias:', error);
      setMedias([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    fetchMedias(page, pageSize || pagination.pageSize);
  };

  const handleMediaInfo = (media: MediaItem) => {
    setSelectedMedia(media);
    setDrawerVisible(true);
  };

  const handleSelectMedia = (media: MediaItem | MediaItem[]) => {
    if (onSelect) {
      onSelect(media);
      setSelectedMedia(null);
      setSelectedMediaList([]);
      onOpenChange(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const result = await ApiService.request('post', '/upload', formData, {
        'Content-Type': 'multipart/form-data',
      });

      const uploadedFile = Array.isArray(result) ? result[0] : result;
      message.success(`${file.name} uploaded successfully`);

      handleMediaInfo(uploadedFile);
      // Refresh the media list to show the new upload
      fetchMedias(pagination.current, pagination.pageSize);

      return uploadedFile;
    } catch (error) {
      message.error(`Upload failed: ${(error as Error).message}`);
      throw error;
    }
  };

  const toggleMediaSelection = (media: MediaItem) => {
    if (multiple) {
      // For multiple selection
      const isSelected = selectedMediaList.some((item) => item.id === media.id);
      if (isSelected) {
        // Remove from selection
        setSelectedMediaList(
          selectedMediaList.filter((item) => item.id !== media.id)
        );
      } else {
        // Add to selection
        setSelectedMediaList([...selectedMediaList, media]);
      }
    } else {
      // For single selection
      setSelectedMedia(media);
    }
  };

  const handleDoubleClickSelect = (media: MediaItem) => {
    if (!multiple) {
      // In single mode, double click selects the media directly
      handleSelectMedia(media);
    }
  };

  const handleAddExternalMedia = () => {
    if (!externalUrl) {
      message.error('Please enter a valid URL');
      return;
    }

    try {
      // Create a mock media item for the external URL
      const externalMedia: MediaItem = {
        id: Date.now(), // Use timestamp as unique ID
        name: externalUrl.split('/').pop() || 'External Media',
        url: externalUrl,
        mime: 'image/jpeg', // Default to image, could be improved
        size: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Select the external media
      handleSelectMedia(externalMedia);
      setExternalUrl('');
    } catch (error) {
      message.error(
        'Failed to add external media: ' + (error as Error).message
      );
    }
  };

  useEffect(() => {
    if (open) {
      fetchMedias();
    }
  }, [open]);

  const renderMediaCard = (media: MediaItem) => {
    const isImage = media.mime?.startsWith('image/');
    const mediaUrl = import.meta.env.VITE_MEDIA_URL + media.url;

    // Check if media is selected (for both single and multiple modes)
    const isSelected = multiple
      ? selectedMediaList.some((item) => item.id === media.id)
      : selectedMedia?.id === media.id;

    return (
      <Col xs={12} sm={8} md={6} lg={4} key={media.id}>
        <Card
          size='small'
          hoverable
          style={{
            marginBottom: 16,
            cursor: 'pointer',
            border: isSelected ? '2px solid #1890ff' : '1px solid #f0f0f0',
          }}
          onClick={() => {
            if (multiple) {
              toggleMediaSelection(media);
            } else {
              handleMediaInfo(media);
            }
          }}
          onDoubleClick={() => handleDoubleClickSelect(media)}
          cover={
            <div
              style={{ height: 120, overflow: 'hidden', position: 'relative' }}
              onClick={(e) => {
                if (!multiple) {
                  e.stopPropagation();
                  handleMediaInfo(media);
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleDoubleClickSelect(media);
              }}
            >
              {isImage ? (
                <Image
                  src={mediaUrl}
                  alt={media.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  preview={false}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    fontSize: '14px',
                    color: '#666',
                  }}
                >
                  <FileOutlined
                    style={{ fontSize: '24px', marginBottom: '8px' }}
                  />
                  <div>
                    {media.name.split('.').pop()?.toUpperCase() || 'FILE'}
                  </div>
                </div>
              )}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isSelected ? (
                  <CheckCircleOutlined
                    style={{ color: 'green', fontSize: '18px' }}
                  />
                ) : (
                  <InfoCircleOutlined style={{ color: 'blue' }} />
                )}
              </div>
            </div>
          }
        >
          <Card.Meta
            title={
              <Text ellipsis style={{ fontSize: '14px' }} title={media.name}>
                {media.name}
              </Text>
            }
          />
        </Card>
      </Col>
    );
  };

  return (
    <Modal
      title='Media Manager'
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={[
        <Button key='cancel' onClick={() => onOpenChange(false)}>
          Cancel
        </Button>,
        <Button
          key='select'
          type='primary'
          onClick={() => {
            if (multiple) {
              if (selectedMediaList.length > 0) {
                handleSelectMedia(selectedMediaList);
              }
            } else {
              if (selectedMedia) {
                handleSelectMedia(selectedMedia);
              }
            }
          }}
          disabled={multiple ? selectedMediaList.length === 0 : !selectedMedia}
        >
          <SelectOutlined />{' '}
          {multiple ? `Select (${selectedMediaList.length})` : 'Select'}
        </Button>,
      ]}
      width={1400}
      style={{ top: 20 }}
    >
      <div style={{ display: 'flex', height: '70vh' }}>
        <div style={{ flex: 1, marginRight: drawerVisible ? 16 : 0 }}>
          <Spin spinning={loading}>
            {medias.length === 0 && !loading ? (
              <Empty description='No media files found' />
            ) : (
              <>
                <Row gutter={[16, 16]}>{medias.map(renderMediaCard)}</Row>

                {pagination.total > 0 && (
                  <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Pagination
                      current={pagination.current}
                      pageSize={pagination.pageSize}
                      total={pagination.total}
                      showSizeChanger
                      showQuickJumper
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`
                      }
                      onChange={handlePageChange}
                      onShowSizeChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </Spin>
        </div>

        <div
          style={{
            width: 400,
            maxWidth: 400,
            borderLeft: '1px solid #f0f0f0',
            paddingLeft: 16,
            overflowY: 'auto',
          }}
        >
          {drawerVisible && selectedMedia ? (
            <>
              <div
                style={{
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3 style={{ margin: 0 }}>Media Information</h3>
                <Button
                  type='text'
                  onClick={() => {
                    setDrawerVisible(false);
                    setSelectedMedia(null);
                  }}
                  style={{ padding: '4px 8px' }}
                >
                  ✕
                </Button>
              </div>

              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                {selectedMedia.mime?.startsWith('image/') ? (
                  <Image
                    src={import.meta.env.VITE_MEDIA_URL + selectedMedia.url}
                    alt={selectedMedia.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 200,
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 200,
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      fontSize: '16px',
                      color: '#666',
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      📄
                    </div>
                    <div>
                      {selectedMedia.name.split('.').pop()?.toUpperCase() ||
                        'FILE'}
                    </div>
                  </div>
                )}
              </div>

              <Descriptions column={1} size='small'>
                <Descriptions.Item label='Name'>
                  <Text copyable>{selectedMedia.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label='Type'>
                  {selectedMedia.mime}
                </Descriptions.Item>
                <Descriptions.Item label='Size'>
                  {formatSize(selectedMedia.size)}
                </Descriptions.Item>
                <Descriptions.Item label='Created'>
                  {new Date(selectedMedia.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label='Updated'>
                  {new Date(selectedMedia.updatedAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label='URL'>
                  <Text copyable style={{ fontSize: '12px' }}>
                    {import.meta.env.VITE_MEDIA_URL + selectedMedia.url}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </>
          ) : (
            <div>
              <h3 style={{ margin: '0 0 16px 0' }}>Add External Media</h3>

              <div style={{ marginBottom: 24 }}>
                <Input
                  placeholder='https://example.com/image.jpg'
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  addonBefore={<LinkOutlined />}
                  style={{ marginBottom: 8 }}
                />
                <Button
                  type='primary'
                  onClick={handleAddExternalMedia}
                  disabled={!externalUrl}
                  block
                >
                  Add External Media
                </Button>
              </div>

              <h3 style={{ margin: '0 0 16px 0' }}>Upload Media</h3>

              <Upload.Dragger
                name='files'
                multiple={false}
                accept='*'
                beforeUpload={(file: File) => {
                  const isValidSize = file.size / 1024 / 1024 < 10; // 10MB limit
                  if (!isValidSize) {
                    message.error('File must be smaller than 10MB!');
                    return Upload.LIST_IGNORE;
                  }
                  return true;
                }}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    await handleUpload(file as File);
                    onSuccess?.(file);
                  } catch (error) {
                    onError?.(error as Error);
                  }
                }}
                showUploadList={false}
                style={{
                  border: '2px dashed #d9d9d9',
                  borderRadius: 8,
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                }}
              >
                <p className='ant-upload-drag-icon'>
                  <UploadOutlined
                    style={{ fontSize: '48px', color: '#1890ff' }}
                  />
                </p>
                <p
                  className='ant-upload-text'
                  style={{ fontSize: '16px', margin: '8px 0' }}
                >
                  Click or drag file to this area to upload
                </p>
                <p
                  className='ant-upload-hint'
                  style={{ color: '#666', fontSize: '14px' }}
                >
                  Support for images, videos, audio, PDF, and documents
                </p>
              </Upload.Dragger>

              <div style={{ marginTop: 24 }}>
                <h4 style={{ margin: '0 0 12px 0' }}>Upload Guidelines:</h4>
                <ul
                  style={{
                    paddingLeft: 20,
                    margin: 0,
                    fontSize: '14px',
                    color: '#666',
                  }}
                >
                  <li>Maximum file size: 10MB</li>
                  <li>
                    Supported formats: Images, Videos, Audio, PDF, Documents
                  </li>
                  <li>Files will be available immediately after upload</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
