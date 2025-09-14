import {
  CodeOutlined,
  DesktopOutlined,
  EyeOutlined,
  MobileOutlined,
  RedoOutlined,
  SaveOutlined,
  TabletOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import GjsEditor, {
  BlocksProvider,
  Canvas,
  useEditor,
  WithEditor,
} from '@grapesjs/react';
import {
  Button,
  Card,
  Col,
  Divider,
  Layout,
  Row,
  Space,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import grapesjs, { type Editor } from 'grapesjs';
import React, { useCallback, useState } from 'react';

const { Title } = Typography;
const { Sider, Header, Content } = Layout;

// Custom Toolbar Component
function EditorToolbar({
  previewMode,
  setPreviewMode,
}: {
  previewMode: boolean;
  setPreviewMode: (value: boolean) => void;
}) {
  const editor = useEditor();
  const [device, setDevice] = useState('desktop');
  const { token } = theme.useToken();

  const handlePreview = useCallback(() => {
    if (previewMode) {
      // Exit preview mode - show components and panels
      editor.runCommand('core:preview-stop');
      editor.runCommand('core:component-outline');
    } else {
      // Enter preview mode - hide components and panels
      editor.runCommand('core:preview');
    }
    setPreviewMode(!previewMode);
  }, [editor, previewMode, setPreviewMode]);

  const handleSave = useCallback(() => {
    const html = editor.getHtml();
    const css = editor.getCss();
    console.log('Save template:', { html, css });
  }, [editor]);

  const handleDeviceChange = useCallback(
    (newDevice: string) => {
      setDevice(newDevice);
      editor.setDevice(newDevice);
    },
    [editor]
  );

  return (
    <Header
      style={{
        background: token.colorBgContainer,
        padding: '0 16px',
        borderBottom: `1px solid ${token.colorBorder}`,
      }}
    >
      <Row justify='space-between' align='middle'>
        <Col>
          <Title level={4} style={{ margin: 0, color: token.colorText }}>
            Email Template Builder
          </Title>
        </Col>
        <Col>
          <Space>
            <Space.Compact>
              <Tooltip title='Desktop'>
                <Button
                  type={device === 'desktop' ? 'primary' : 'default'}
                  icon={<DesktopOutlined />}
                  onClick={() => handleDeviceChange('desktop')}
                />
              </Tooltip>
              <Tooltip title='Tablet'>
                <Button
                  type={device === 'tablet' ? 'primary' : 'default'}
                  icon={<TabletOutlined />}
                  onClick={() => handleDeviceChange('tablet')}
                />
              </Tooltip>
              <Tooltip title='Mobile'>
                <Button
                  type={device === 'mobile' ? 'primary' : 'default'}
                  icon={<MobileOutlined />}
                  onClick={() => handleDeviceChange('mobile')}
                />
              </Tooltip>
            </Space.Compact>
            <Divider type='vertical' />
            <Tooltip title='Undo'>
              <Button
                icon={<UndoOutlined />}
                onClick={() => editor.runCommand('core:undo')}
              />
            </Tooltip>
            <Tooltip title='Redo'>
              <Button
                icon={<RedoOutlined />}
                onClick={() => editor.runCommand('core:redo')}
              />
            </Tooltip>
            <Divider type='vertical' />
            <Tooltip title={previewMode ? 'Exit Preview' : 'Preview'}>
              <Button
                type={previewMode ? 'primary' : 'default'}
                icon={previewMode ? <CodeOutlined /> : <EyeOutlined />}
                onClick={handlePreview}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            </Tooltip>
            <Button type='primary' icon={<SaveOutlined />} onClick={handleSave}>
              Save Template
            </Button>
          </Space>
        </Col>
      </Row>
    </Header>
  );
}

// Left Sidebar with proper drag and drop
function LeftSidebar() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        height: '100%',
        background: token.colorBgContainer,
        padding: 16,
      }}
    >
      <Title level={5} style={{ margin: '0 0 16px 0', fontSize: 14 }}>
        Components
      </Title>
      <BlocksProvider>
        {(props) => (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
            }}
          >
            {props.blocks.map((block: any) => (
              <Card
                key={block.getId()}
                size='small'
                hoverable
                style={{
                  textAlign: 'center',
                  cursor: 'grab',
                  border: `1px solid ${token.colorBorder}`,
                }}
                bodyStyle={{ padding: 8 }}
                draggable
                onDragStart={(ev) => props.dragStart(block, ev.nativeEvent)}
                onDragEnd={() => props.dragStop()}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>
                  {block.getMedia ? block.getMedia() : '📦'}
                </div>
                <div style={{ fontSize: 11 }}>{block.getLabel()}</div>
              </Card>
            ))}
          </div>
        )}
      </BlocksProvider>
    </div>
  );
}

// Right Sidebar with functional Properties
function RightSidebar() {
  const editor = useEditor();
  const { token } = theme.useToken();
  const [selectedComponent, setSelectedComponent] = useState<any>(null);

  // Listen for component selection changes
  React.useEffect(() => {
    const handleSelect = () => {
      const selected = editor.getSelected();
      setSelectedComponent(selected);

      // Component selection tracking
      // Video detection logic is handled in the properties panel rendering
    };

    const handleDeselect = () => {
      setSelectedComponent(null);
    };

    editor.on('component:selected', handleSelect);
    editor.on('component:deselected', handleDeselect);

    return () => {
      editor.off('component:selected', handleSelect);
      editor.off('component:deselected', handleDeselect);
    };
  }, [editor]);

  const updateComponent = () => {
    // Trigger a re-render
    editor.trigger('change:canvasOffset');
  };

  return (
    <div
      style={{
        height: '100%',
        background: token.colorBgContainer,
        padding: 16,
        overflow: 'auto',
      }}
    >
      {/* Component Properties */}
      <Title level={5} style={{ margin: '0 0 12px 0', fontSize: 14 }}>
        Properties
      </Title>
      {selectedComponent ? (
        <Card size='small' style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <Typography.Text strong style={{ fontSize: 12 }}>
              Component: {selectedComponent.get('tagName') || 'Element'}
            </Typography.Text>
          </div>

          {/* Text Content for text-based elements */}
          {(selectedComponent.get('tagName') === 'div' ||
            selectedComponent.get('tagName') === 'p' ||
            selectedComponent.get('tagName') === 'h1' ||
            selectedComponent.get('tagName') === 'h2' ||
            selectedComponent.get('tagName') === 'h3' ||
            selectedComponent.get('tagName') === 'a') && (
            <div style={{ marginBottom: 8 }}>
              <Typography.Text
                style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
              >
                Text Content
              </Typography.Text>
              <input
                type='text'
                value={selectedComponent.get('content') || ''}
                onChange={(e) => {
                  selectedComponent.set('content', e.target.value);
                  updateComponent();
                }}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: 4,
                  fontSize: 11,
                }}
                placeholder='Enter text content'
              />
            </div>
          )}

          {/* Background Color */}
          <div style={{ marginBottom: 8 }}>
            <Typography.Text
              style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
            >
              Background Color
            </Typography.Text>
            <input
              type='color'
              value={
                selectedComponent.getStyle('background-color') || '#ffffff'
              }
              onChange={(e) => {
                selectedComponent.setStyle({
                  'background-color': e.target.value,
                });
                updateComponent();
              }}
              style={{
                width: '100%',
                height: 30,
                border: `1px solid ${token.colorBorder}`,
                borderRadius: 4,
              }}
            />
          </div>

          {/* Text Color */}
          <div style={{ marginBottom: 8 }}>
            <Typography.Text
              style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
            >
              Text Color
            </Typography.Text>
            <input
              type='color'
              value={selectedComponent.getStyle('color') || '#000000'}
              onChange={(e) => {
                selectedComponent.setStyle({ color: e.target.value });
                updateComponent();
              }}
              style={{
                width: '100%',
                height: 30,
                border: `1px solid ${token.colorBorder}`,
                borderRadius: 4,
              }}
            />
          </div>

          {/* Font Size */}
          <div style={{ marginBottom: 8 }}>
            <Typography.Text
              style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
            >
              Font Size
            </Typography.Text>
            <input
              type='text'
              value={selectedComponent.getStyle('font-size') || ''}
              onChange={(e) => {
                selectedComponent.setStyle({ 'font-size': e.target.value });
                updateComponent();
              }}
              style={{
                width: '100%',
                padding: '4px 8px',
                border: `1px solid ${token.colorBorder}`,
                borderRadius: 4,
                fontSize: 11,
              }}
              placeholder='e.g., 16px, 1.2em'
            />
          </div>

          {/* Padding */}
          <div style={{ marginBottom: 8 }}>
            <Typography.Text
              style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
            >
              Padding
            </Typography.Text>
            <input
              type='text'
              value={selectedComponent.getStyle('padding') || ''}
              onChange={(e) => {
                selectedComponent.setStyle({ padding: e.target.value });
                updateComponent();
              }}
              style={{
                width: '100%',
                padding: '4px 8px',
                border: `1px solid ${token.colorBorder}`,
                borderRadius: 4,
                fontSize: 11,
              }}
              placeholder='e.g., 10px or 10px 20px'
            />
          </div>

          {/* Margin */}
          <div style={{ marginBottom: 8 }}>
            <Typography.Text
              style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
            >
              Margin
            </Typography.Text>
            <input
              type='text'
              value={selectedComponent.getStyle('margin') || ''}
              onChange={(e) => {
                selectedComponent.setStyle({ margin: e.target.value });
                updateComponent();
              }}
              style={{
                width: '100%',
                padding: '4px 8px',
                border: `1px solid ${token.colorBorder}`,
                borderRadius: 4,
                fontSize: 11,
              }}
              placeholder='e.g., 10px or 10px 20px'
            />
          </div>

          {/* Border Radius */}
          <div style={{ marginBottom: 8 }}>
            <Typography.Text
              style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
            >
              Border Radius
            </Typography.Text>
            <input
              type='text'
              value={selectedComponent.getStyle('border-radius') || ''}
              onChange={(e) => {
                selectedComponent.setStyle({ 'border-radius': e.target.value });
                updateComponent();
              }}
              style={{
                width: '100%',
                padding: '4px 8px',
                border: `1px solid ${token.colorBorder}`,
                borderRadius: 4,
                fontSize: 11,
              }}
              placeholder='e.g., 4px, 50%'
            />
          </div>

          {/* For images - src attribute */}
          {selectedComponent.get('tagName') === 'img' && (
            <div style={{ marginBottom: 8 }}>
              <Typography.Text
                style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
              >
                Image Source
              </Typography.Text>
              <input
                type='text'
                value={selectedComponent.get('src') || ''}
                onChange={(e) => {
                  selectedComponent.set('src', e.target.value);
                  updateComponent();
                }}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: 4,
                  fontSize: 11,
                }}
                placeholder='Enter image URL'
              />
            </div>
          )}

          {/* For links - href attribute */}
          {selectedComponent.get('tagName') === 'a' && (
            <div style={{ marginBottom: 8 }}>
              <Typography.Text
                style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
              >
                Link URL
              </Typography.Text>
              <input
                type='text'
                value={selectedComponent.get('href') || ''}
                onChange={(e) => {
                  selectedComponent.set('href', e.target.value);
                  updateComponent();
                }}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: 4,
                  fontSize: 11,
                }}
                placeholder='Enter link URL'
              />
            </div>
          )}

          {/* For video thumbnails - enhanced detection */}
          {
            // Direct link with video thumbnail
            ((selectedComponent.get('tagName') === 'a' &&
              selectedComponent.find('img').length > 0 &&
              (selectedComponent
                .find('img')
                .at(0)
                ?.get('alt')
                ?.includes('Video') ||
                selectedComponent
                  .find('img')
                  .at(0)
                  ?.get('class')
                  ?.includes('video-thumbnail'))) ||
              // Video component div
              (selectedComponent.get('tagName') === 'div' &&
                (selectedComponent.get('class')?.includes('video-component') ||
                  (selectedComponent.find('a').length > 0 &&
                    selectedComponent.find('img').length > 0 &&
                    (selectedComponent
                      .find('img')
                      .at(0)
                      ?.get('alt')
                      ?.includes('Video') ||
                      selectedComponent
                        .find('img')
                        .at(0)
                        ?.get('class')
                        ?.includes('video-thumbnail') ||
                      selectedComponent
                        .find('img')
                        .at(0)
                        ?.get('src')
                        ?.includes('youtube.com') ||
                      selectedComponent
                        .find('img')
                        .at(0)
                        ?.get('src')
                        ?.includes('vimeo.com'))))) ||
              // Direct image selection with video characteristics
              (selectedComponent.get('tagName') === 'img' &&
                selectedComponent.parent() &&
                selectedComponent.parent()?.get('tagName') === 'a' &&
                (selectedComponent.get('alt')?.includes('Video') ||
                  selectedComponent.get('class')?.includes('video-thumbnail') ||
                  selectedComponent.get('src')?.includes('youtube.com') ||
                  selectedComponent.get('src')?.includes('vimeo.com') ||
                  selectedComponent
                    .parent()
                    ?.parent()
                    ?.get('class')
                    ?.includes('video-component')))) && (
              <>
                <div style={{ marginBottom: 8 }}>
                  <Typography.Text
                    style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
                  >
                    Video Link URL
                  </Typography.Text>
                  <input
                    type='text'
                    value={
                      selectedComponent.get('tagName') === 'a'
                        ? selectedComponent.get('href') || ''
                        : selectedComponent.get('tagName') === 'div' &&
                          selectedComponent.find('a').length > 0
                        ? selectedComponent.find('a').at(0).get('href') || ''
                        : selectedComponent.get('tagName') === 'img' &&
                          selectedComponent.parent() &&
                          selectedComponent.parent().get('tagName') === 'a'
                        ? selectedComponent.parent().get('href') || ''
                        : selectedComponent.get('tagName') === 'img' &&
                          selectedComponent.parent() &&
                          selectedComponent.parent().parent() &&
                          selectedComponent.parent().parent().find('a').length >
                            0
                        ? selectedComponent
                            .parent()
                            .parent()
                            .find('a')
                            .at(0)
                            .get('href') || ''
                        : ''
                    }
                    onChange={(e) => {
                      if (selectedComponent.get('tagName') === 'a') {
                        selectedComponent.set('href', e.target.value);
                      } else if (
                        selectedComponent.get('tagName') === 'div' &&
                        selectedComponent.find('a').length > 0
                      ) {
                        selectedComponent
                          .find('a')
                          .at(0)
                          .set('href', e.target.value);
                      } else if (
                        selectedComponent.get('tagName') === 'img' &&
                        selectedComponent.parent() &&
                        selectedComponent.parent().get('tagName') === 'a'
                      ) {
                        selectedComponent.parent().set('href', e.target.value);
                      } else if (
                        selectedComponent.get('tagName') === 'img' &&
                        selectedComponent.parent() &&
                        selectedComponent.parent().parent() &&
                        selectedComponent.parent().parent().find('a').length > 0
                      ) {
                        selectedComponent
                          .parent()
                          .parent()
                          .find('a')
                          .at(0)
                          .set('href', e.target.value);
                      }
                      updateComponent();
                    }}
                    style={{
                      width: '100%',
                      padding: '4px 8px',
                      border: `1px solid ${token.colorBorder}`,
                      borderRadius: 4,
                      fontSize: 11,
                    }}
                    placeholder='Enter video URL (YouTube, Vimeo, etc.)'
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Typography.Text
                    style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
                  >
                    Thumbnail Image URL
                  </Typography.Text>
                  <input
                    type='text'
                    value={
                      selectedComponent.get('tagName') === 'img'
                        ? selectedComponent.get('src') || ''
                        : selectedComponent.find('img').length > 0
                        ? selectedComponent.find('img').at(0).get('src') || ''
                        : ''
                    }
                    onChange={(e) => {
                      if (selectedComponent.get('tagName') === 'img') {
                        selectedComponent.set('src', e.target.value);
                      } else if (selectedComponent.find('img').length > 0) {
                        selectedComponent
                          .find('img')
                          .at(0)
                          .set('src', e.target.value);
                      }
                      updateComponent();
                    }}
                    style={{
                      width: '100%',
                      padding: '4px 8px',
                      border: `1px solid ${token.colorBorder}`,
                      borderRadius: 4,
                      fontSize: 11,
                    }}
                    placeholder='Enter thumbnail image URL'
                  />
                </div>
                <div
                  style={{
                    marginBottom: 8,
                    padding: '8px',
                    background: token.colorBgContainer,
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: 4,
                  }}
                >
                  <Typography.Text
                    style={{
                      fontSize: 10,
                      color: token.colorTextSecondary,
                      display: 'block',
                      marginBottom: 4,
                    }}
                  >
                    💡 Quick Setup for YouTube:
                  </Typography.Text>
                  <Typography.Text
                    style={{ fontSize: 10, color: token.colorTextSecondary }}
                  >
                    For YouTube videos, you can use:
                    https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
                  </Typography.Text>
                </div>
              </>
            )
          }

          {/* For videos - legacy video elements */}
          {(selectedComponent.get('tagName') === 'video' ||
            selectedComponent.get('tagName') === 'iframe' ||
            selectedComponent.get('type') === 'video') && (
            <div style={{ marginBottom: 8 }}>
              <Typography.Text
                style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
              >
                Video Source URL
              </Typography.Text>
              <input
                type='text'
                value={selectedComponent.get('src') || ''}
                onChange={(e) => {
                  selectedComponent.set('src', e.target.value);
                  updateComponent();
                }}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: 4,
                  fontSize: 11,
                }}
                placeholder='Enter video URL (YouTube, Vimeo, etc.)'
              />
            </div>
          )}

          {/* For videos - width and height */}
          {(selectedComponent.get('tagName') === 'video' ||
            selectedComponent.get('tagName') === 'iframe' ||
            selectedComponent.get('type') === 'video') && (
            <>
              <div style={{ marginBottom: 8 }}>
                <Typography.Text
                  style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
                >
                  Video Width
                </Typography.Text>
                <input
                  type='text'
                  value={selectedComponent.getStyle('width') || ''}
                  onChange={(e) => {
                    selectedComponent.setStyle({ width: e.target.value });
                    updateComponent();
                  }}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: 4,
                    fontSize: 11,
                  }}
                  placeholder='e.g., 100%, 560px'
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <Typography.Text
                  style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
                >
                  Video Height
                </Typography.Text>
                <input
                  type='text'
                  value={selectedComponent.getStyle('height') || ''}
                  onChange={(e) => {
                    selectedComponent.setStyle({ height: e.target.value });
                    updateComponent();
                  }}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: 4,
                    fontSize: 11,
                  }}
                  placeholder='e.g., 315px, auto'
                />
              </div>
            </>
          )}
        </Card>
      ) : (
        <Card size='small' style={{ marginBottom: 16 }}>
          <Typography.Text
            style={{ fontSize: 12, color: token.colorTextSecondary }}
          >
            Select a component to edit its properties
          </Typography.Text>
        </Card>
      )}

      {/* Component Layers */}
      <Title level={5} style={{ margin: '0 0 12px 0', fontSize: 14 }}>
        Layers
      </Title>
      <Card size='small'>
        <div style={{ maxHeight: 200, overflow: 'auto' }}>
          {editor
            .getWrapper()
            ?.components()
            .map((component: any, index: number) => (
              <div
                key={component.getId ? component.getId() : index}
                style={{
                  padding: '6px 8px',
                  cursor: 'pointer',
                  borderRadius: 3,
                  marginBottom: 2,
                  backgroundColor:
                    selectedComponent === component
                      ? token.colorPrimaryBg
                      : 'transparent',
                  border:
                    selectedComponent === component
                      ? `1px solid ${token.colorPrimary}`
                      : '1px solid transparent',
                  fontSize: 11,
                }}
                onClick={() => {
                  editor.select(component);
                  setSelectedComponent(component);
                }}
              >
                <Typography.Text ellipsis style={{ fontSize: 11 }}>
                  {component.getName
                    ? component.getName()
                    : component.get
                    ? component.get('tagName')
                    : 'Component'}
                </Typography.Text>
              </div>
            )) || (
            <Typography.Text
              style={{ fontSize: 12, color: token.colorTextSecondary }}
            >
              No components in canvas
            </Typography.Text>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function EmailTemplateBuilder() {
  const [previewMode, setPreviewMode] = useState(false);
  const { token } = theme.useToken();

  const editorHeight = '89vh';

  const onEditor = (editor: Editor) => {
    console.log('Editor loaded', { editor });

    // Configure device manager for responsive design
    const deviceManager = editor.DeviceManager;
    deviceManager.add({
      id: 'desktop',
      name: 'Desktop',
      width: '',
    });
    deviceManager.add({
      id: 'tablet',
      name: 'Tablet',
      width: '768px',
      widthMedia: '992px',
    });
    deviceManager.add({
      id: 'mobile',
      name: 'Mobile',
      width: '320px',
      widthMedia: '768px',
    });

    // Add CSS for layout components
    editor.addStyle(`
      .row {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        flex-wrap: nowrap;
        padding: 10px;
        margin: 0;
        min-height: 75px;
      }
      .row-cell {
        min-height: 75px;
        flex-grow: 1;
        flex-basis: 100%;
        padding: 5px;
        margin: 0;
        border: 1px dashed #ccc;
      }
      .row-cell-30 {
        flex-basis: 30% !important;
        flex-grow: 0;
      }
      .row-cell-70 {
        flex-basis: 70% !important;
        flex-grow: 0;
      }
      @media (max-width: 768px) {
        .row {
          flex-wrap: wrap;
        }
        .row-cell {
          flex-basis: 100%;
        }
        .row-cell-30,
        .row-cell-70 {
          flex-basis: 100% !important;
        }
      }
    `);

    // Add default GrapesJS blocks with proper icons
    editor.BlockManager.add('column1', {
      label: '1 Column',
      content:
        '<div class="row" data-gjs-droppable=".row-cell" data-gjs-resizable data-gjs-name="Row"><div class="row-cell" data-gjs-draggable=".row"></div></div>',
      category: 'Layout',
      media: '▬',
    });

    editor.BlockManager.add('column2', {
      label: '2 Columns',
      content:
        '<div class="row" data-gjs-droppable=".row-cell" data-gjs-resizable data-gjs-name="Row"><div class="row-cell" data-gjs-draggable=".row"></div><div class="row-cell" data-gjs-draggable=".row"></div></div>',
      category: 'Layout',
      media: '▬▬',
    });

    editor.BlockManager.add('column2-37', {
      label: '2 Columns (3/7)',
      content:
        '<div class="row" data-gjs-droppable=".row-cell" data-gjs-resizable data-gjs-name="Row"><div class="row-cell row-cell-30" data-gjs-draggable=".row" style="flex-basis: 30%;"></div><div class="row-cell row-cell-70" data-gjs-draggable=".row" style="flex-basis: 70%;"></div></div>',
      category: 'Layout',
      media: '▌▬',
    });

    editor.BlockManager.add('column3', {
      label: '3 Columns',
      content:
        '<div class="row" data-gjs-droppable=".row-cell" data-gjs-resizable data-gjs-name="Row"><div class="row-cell" data-gjs-draggable=".row"></div><div class="row-cell" data-gjs-draggable=".row"></div><div class="row-cell" data-gjs-draggable=".row"></div></div>',
      category: 'Layout',
      media: '▬▬▬',
    });

    editor.BlockManager.add('text', {
      label: 'Text',
      content: '<div data-gjs-type="text">Insert your text here</div>',
      category: 'Basic',
      media: '📝',
    });

    editor.BlockManager.add('link', {
      label: 'Link',
      content: '<a href="#">Link</a>',
      category: 'Basic',
      media: '🔗',
    });

    // editor.BlockManager.add('image', {
    //   label: 'Image',
    //   content: { type: 'image' },
    //   category: 'Basic',
    //   media: '🖼️',
    // });

    editor.BlockManager.add('video', {
      label: 'Video',
      content: `
        <div class="video-component" style="position: relative; display: inline-block; max-width: 100%; text-align: center;">
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" style="text-decoration: none; display: block;">
            <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" alt="Video Thumbnail" class="video-thumbnail" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
              <div style="width: 0; height: 0; border-left: 25px solid white; border-top: 15px solid transparent; border-bottom: 15px solid transparent; margin-left: 5px;"></div>
            </div>
          </a>
          <p style="margin: 10px 0 0 0; font-family: Arial, sans-serif; font-size: 14px; color: #666;">Click to watch video</p>
        </div>
      `,
      category: 'Media',
      media: '🎥',
    });

    editor.BlockManager.add('map', {
      label: 'Map',
      content: {
        type: 'map',
        style: { height: '350px' },
      },
      category: 'Media',
      media: '🗺️',
    });

    // Add our custom email template blocks
    editor.BlockManager.add('text-block', {
      label: 'Text Centered',
      content:
        '<div style="padding: 20px; font-family: Arial, sans-serif; line-height: 1.5;">Insert your text here. You can edit this content by clicking on it.</div>',
      category: 'Basic',
      media: '📝',
    });

    // editor.BlockManager.add('image-block', {
    //   label: 'Image',
    //   content:
    //     '<img src="https://picsum.photos/400/250" alt="placeholder" style="width: 100%; height: auto; display: block; border-radius: 8px;">',
    //   category: 'Basic',
    //   media: '🖼️',
    // });

    editor.BlockManager.add('image-simple-block', {
      label: 'Image',
      content:
        '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxyZWN0IHg9IjE3NSIgeT0iMTAwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNEOUQ5RDkiLz4KPHN2ZyB4PSIxODUiIHk9IjExMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjOTk5OTk5Ij4KPHA+SW1hZ2U8L3A+Cjwvc3ZnPgo8L3N2Zz4K" alt="placeholder" style="width: 100%; height: auto; display: block; border-radius: 8px;">',
      category: 'Basic',
      media: '🖼️',
    });

    editor.BlockManager.add('button-block', {
      label: 'Button',
      content:
        '<div style="text-align: center; padding: 20px;"><a href="#" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; font-family: Arial, sans-serif; font-weight: bold;">Click Here</a></div>',
      category: 'Basic',
      media: '🔘',
    });

    editor.BlockManager.add('divider-block', {
      label: 'Divider',
      content:
        '<div style="padding: 20px 0;"><hr style="border: none; height: 2px; background: linear-gradient(to right, transparent, #dee2e6, transparent); margin: 0;"></div>',
      category: 'Basic',
      media: '➖',
    });

    // Email specific blocks
    editor.BlockManager.add('header-block', {
      label: 'Header',
      content: `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; font-family: Arial, sans-serif;">
          <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold;">Welcome</h1>
          <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px;">Your beautiful email starts here</p>
        </div>
      `,
      category: 'Email',
      media: '📧',
    });

    editor.BlockManager.add('footer-block', {
      label: 'Footer',
      content: `
        <div style="background: #2c3e50; color: white; padding: 40px 20px; text-align: center; font-family: Arial, sans-serif;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: white; font-size: 18px;">Stay Connected</h3>
            <p style="margin: 0; color: #bdc3c7; font-size: 14px;">Follow us on social media for updates</p>
          </div>
          <div style="border-top: 1px solid #34495e; padding-top: 20px; margin-top: 20px;">
            <p style="margin: 0 0 10px 0; color: #bdc3c7; font-size: 12px;">© 2024 Your Company. All rights reserved.</p>
            <p style="margin: 0; color: #95a5a6; font-size: 11px;">
              <a href="#" style="color: #95a5a6; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
              <a href="#" style="color: #95a5a6; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
            </p>
          </div>
        </div>
      `,
      category: 'Email',
      media: '🔗',
    });

    editor.BlockManager.add('social-block', {
      label: 'Social',
      content: `
        <div style="text-align: center; padding: 30px 20px; background: #f8f9fa; font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 20px 0; color: #343a40; font-size: 20px;">Follow Us</h3>
          <div style="display: inline-block;">
            <a href="#" style="display: inline-block; margin: 0 10px; padding: 15px; background: #1877f2; color: white; text-decoration: none; border-radius: 50%; width: 50px; height: 50px; line-height: 20px; font-weight: bold;">f</a>
            <a href="#" style="display: inline-block; margin: 0 10px; padding: 15px; background: #1da1f2; color: white; text-decoration: none; border-radius: 50%; width: 50px; height: 50px; line-height: 20px; font-weight: bold;">t</a>
            <a href="#" style="display: inline-block; margin: 0 10px; padding: 15px; background: #0077b5; color: white; text-decoration: none; border-radius: 50%; width: 50px; height: 50px; line-height: 20px; font-weight: bold;">in</a>
            <a href="#" style="display: inline-block; margin: 0 10px; padding: 15px; background: #e1306c; color: white; text-decoration: none; border-radius: 50%; width: 50px; height: 50px; line-height: 20px; font-weight: bold;">ig</a>
          </div>
        </div>
      `,
      category: 'Email',
      media: '📱',
    });

    // Set initial content
    editor.setComponents(`
      <div style="max-width: 600px; margin: 0 auto; background: white; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold;">Welcome to our Newsletter</h1>
          <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px;">Stay updated with our latest news and offers</p>
        </div>
        <div style="padding: 40px 20px;">
          <p style="margin: 0 0 20px 0; line-height: 1.6; color: #333; font-size: 16px;">
            Thank you for subscribing to our newsletter! We're excited to share our latest updates, exclusive offers, and valuable content with you.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; padding: 15px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Get Started</a>
          </div>
          <p style="margin: 20px 0 0 0; line-height: 1.6; color: #666; font-size: 14px;">
            If you have any questions, feel free to reach out to our support team. We're here to help!
          </p>
        </div>
      </div>
    `);
  };

  return (
    <div
      style={{
        height: editorHeight,
        background: token.colorBgLayout,
        borderTop: '1px solid #ddd',
      }}
    >
      <GjsEditor
        grapesjs={grapesjs}
        grapesjsCss='https://unpkg.com/grapesjs/dist/css/grapes.min.css'
        options={{
          height: editorHeight,
          storageManager: false,
          panels: { defaults: [] },
          canvas: {
            styles: ['https://unpkg.com/grapesjs/dist/css/grapes.min.css'],
          },
          deviceManager: {
            devices: [
              { name: 'Desktop', width: '' },
              { name: 'Tablet', width: '768px' },
              { name: 'Mobile', width: '320px' },
            ],
          },
        }}
        onEditor={onEditor}
      >
        <Layout style={{ height: editorHeight }}>
          <Sider
            width={280}
            collapsedWidth={0}
            style={{
              background: token.colorBgContainer,
              borderRight: `1px solid ${token.colorBorder}`,
            }}
          >
            <WithEditor>
              <LeftSidebar />
            </WithEditor>
          </Sider>

          <Layout>
            <WithEditor>
              <EditorToolbar
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
              />
            </WithEditor>

            <Content
              style={{
                background: '#f5f5f5',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Canvas style={{ height: '100%', width: '100%' }} />
            </Content>
          </Layout>

          <Sider
            width={280}
            collapsedWidth={0}
            style={{
              background: token.colorBgContainer,
              borderLeft: `1px solid ${token.colorBorder}`,
            }}
            reverseArrow
          >
            <WithEditor>
              <RightSidebar />
            </WithEditor>
          </Sider>
        </Layout>
      </GjsEditor>
    </div>
  );
}
