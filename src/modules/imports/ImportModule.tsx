import { InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Select,
  Table,
  Upload,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface FieldMapping {
  csvHeader: string;
  contentTypeField: string;
}

export default function ImportModule() {
  const { name: collectionName } = useParams();

  const [contentType, setContentType] = useState<any>({});
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnUrl =
    searchParams.get('returnUrl') || `/imports/${collectionName}`;

  useEffect(() => {
    if (collectionName) {
      const ct = MetadataService.getContentTypeByModule(collectionName);
      setContentType(ct);
    }
  }, [collectionName]);

  // Initialize field mappings when CSV data and content type are available
  useEffect(() => {
    if (csvData && contentType?.attributes) {
      const availableFields = Object.keys(contentType.attributes);

      const mappings: FieldMapping[] = csvData.headers.map((header) => {
        // Auto-select if header name matches field name (case-insensitive)
        const matchingField = availableFields.find(
          (field) => field.toLowerCase() === header.toLowerCase().trim()
        );

        return {
          csvHeader: header,
          contentTypeField: matchingField || '', // Auto-select matching field or empty
        };
      });

      // Count auto-mapped fields
      const autoMappedCount = mappings.filter(
        (m) => m.contentTypeField !== ''
      ).length;

      setFieldMappings(mappings);

      // Notify user about auto-mapping after a short delay to avoid conflicting with file load message
      if (autoMappedCount > 0) {
        setTimeout(() => {
          message.success(
            `${autoMappedCount} field(s) automatically mapped based on matching names!`
          );
        }, 1000);
      }
    }
  }, [csvData, contentType]);

  const readCsvFile = (file: File): Promise<CsvData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter((line) => line.trim() !== '');

          if (lines.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }

          // Parse CSV (simple implementation - doesn't handle quoted commas)
          const headers = lines[0]
            .split(',')
            .map((h) => h.trim().replace(/"/g, ''));
          const rows = lines
            .slice(1)
            .map((line) =>
              line.split(',').map((cell) => cell.trim().replace(/"/g, ''))
            );

          resolve({ headers, rows });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadedFile(file);
      message.loading('Reading CSV file...', 0);

      const data = await readCsvFile(file);
      setCsvData(data);

      message.destroy();
      message.success(
        `CSV file loaded successfully! Found ${data.headers.length} columns and ${data.rows.length} rows.`
      );
    } catch (error) {
      message.destroy();
      message.error(
        `Failed to read CSV file: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  const handleMappingChange = (csvHeader: string, contentTypeField: string) => {
    setFieldMappings((prev) =>
      prev.map((mapping) =>
        mapping.csvHeader === csvHeader
          ? { ...mapping, contentTypeField }
          : mapping
      )
    );
  };

  const getContentTypeFields = () => {
    if (!contentType?.attributes) return [];

    return Object.keys(contentType.attributes).map((key) => ({
      value: key,
      label: `${key} (${contentType.attributes[key].type})`,
    }));
  };

  const getMappingTableColumns = () => {
    const contentTypeFields = getContentTypeFields();

    return [
      {
        title: 'CSV Header',
        dataIndex: 'csvHeader',
        key: 'csvHeader',
        width: '40%',
        render: (text: string) => <strong>{text}</strong>,
      },
      {
        title: 'Map to Content Type Field',
        dataIndex: 'contentTypeField',
        key: 'contentTypeField',
        width: '60%',
        render: (_: any, record: FieldMapping) => {
          // Check if this is an auto-mapped field
          const isAutoMapped =
            record.contentTypeField &&
            record.contentTypeField.toLowerCase() ===
              record.csvHeader.toLowerCase().trim();

          return (
            <div style={{ position: 'relative' }}>
              <Select
                style={{ width: '100%' }}
                placeholder='Select a field to map'
                value={record.contentTypeField || undefined}
                onChange={(value) =>
                  handleMappingChange(record.csvHeader, value)
                }
                allowClear
                showSearch
                optionFilterProp='label'
                options={[
                  { value: '', label: '-- Skip this column --' },
                  ...contentTypeFields,
                ]}
              />
              {isAutoMapped && (
                <span
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#52c41a',
                    fontSize: '12px',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                  title='Auto-mapped based on matching name'
                >
                  ✓ Auto
                </span>
              )}
            </div>
          );
        },
      },
    ];
  };

  const handleImport = async () => {
    const mappedFields = fieldMappings.filter((m) => m.contentTypeField !== '');

    if (mappedFields.length === 0) {
      message.warning(
        'Please map at least one CSV column to a content type field.'
      );
      return;
    }

    message.info('Import functionality will be implemented next!');
    console.log('Import data:', {
      csvData,
      fieldMappings: mappedFields,
      contentType,
    });

    // Prepare form data for API
    const formData = new FormData();

    // Add the uploaded CSV file
    if (uploadedFile) {
      formData.append('file', uploadedFile);
    }

    // Add collection name
    if (collectionName) {
      formData.append('module', collectionName);
    }

    // Add field mappings as JSON string
    formData.append('fieldMappings', JSON.stringify(mappedFields));

    // Add additional metadata
    formData.append('totalRows', csvData?.rows.length?.toString() || '0');
    formData.append('totalColumns', csvData?.headers.length?.toString() || '0');

    try {
      message.loading('Importing data...', 0);

      // Post to API endpoint
      const response = await ApiService.request(
        'post',
        '/imports/csv',
        formData,
        {
          'Content-Type': 'multipart/form-data',
        }
      );

      message.destroy();
      message.success(response?.message || 'Data imported successfully');
      // Optionally redirect or refresh data
      navigate(returnUrl);
    } catch (error) {
      message.destroy();
      message.error(
        `Import failed: ${
          error instanceof Error ? error.message : 'Network error'
        }`
      );
    }
  };

  const resetImport = () => {
    setCsvData(null);
    setFieldMappings([]);
    setUploadedFile(null);
  };

  return (
    <PageContainer
      header={{
        title: `Import Module: ${collectionName}`,
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: capitalizeFirstLetter(collectionName || ''),
              href: `/collections/${collectionName}`,
            },
            {
              title: 'Import',
            },
          ],
        },
      }}
    >
      {/* File Upload Section */}
      <Card title='Step 1: Upload CSV File' className='!mt-4'>
        <Upload.Dragger
          name='file'
          multiple={false}
          accept='.csv'
          beforeUpload={(file) => {
            handleFileUpload(file);
            return false; // Prevent auto upload
          }}
          className='mb-6'
          disabled={!!csvData}
        >
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>
            {csvData
              ? `File loaded: ${uploadedFile?.name}`
              : 'Click or drag CSV file to this area'}
          </p>
          <p className='ant-upload-hint'>
            {csvData
              ? `${csvData.headers.length} columns, ${csvData.rows.length} rows detected`
              : 'Support for CSV files only. Please ensure your CSV has headers in the first row.'}
          </p>
        </Upload.Dragger>

        {csvData && (
          <div className='flex justify-center'>
            <Button onClick={resetImport}>Upload Different File</Button>
          </div>
        )}
      </Card>

      {/* CSV Preview Section */}
      {csvData && (
        <Card title='Step 2: CSV Preview' className='!mt-4'>
          <Alert
            message='CSV Data Preview'
            description={`Found ${csvData.headers.length} columns and ${csvData.rows.length} rows. Showing first 5 rows below.`}
            type='info'
            icon={<InfoCircleOutlined />}
            className='!mb-4'
          />

          <Table
            dataSource={csvData.rows.slice(0, 5).map((row, index) => ({
              key: index,
              ...csvData.headers.reduce(
                (acc, header, headerIndex) => ({
                  ...acc,
                  [header]: row[headerIndex] || '',
                }),
                {}
              ),
            }))}
            columns={csvData.headers.map((header) => ({
              title: header,
              dataIndex: header,
              key: header,
              ellipsis: true,
            }))}
            pagination={false}
            scroll={{ x: true }}
            size='small'
          />
        </Card>
      )}

      {/* Field Mapping Section */}
      {csvData && contentType?.attributes && (
        <Card
          title='Step 3: Map CSV Headers to Content Type Fields'
          className='!mt-4'
        >
          <Alert
            message='Field Mapping'
            description="Map each CSV column to the corresponding field in your content type. Fields with matching names are automatically mapped. You can skip columns that you don't want to import."
            type='info'
            className='!mb-4'
          />

          <Table
            dataSource={fieldMappings}
            columns={getMappingTableColumns()}
            pagination={false}
            rowKey='csvHeader'
            size='middle'
          />
        </Card>
      )}

      {/* Action Buttons */}
      {csvData && (
        <Card className='!mt-4'>
          <Row justify='center' gutter={16}>
            <Col>
              <Button size='large' onClick={resetImport}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type='primary'
                size='large'
                onClick={handleImport}
                disabled={
                  fieldMappings.filter((m) => m.contentTypeField !== '')
                    .length === 0
                }
              >
                Import Data
              </Button>
            </Col>
          </Row>
        </Card>
      )}
    </PageContainer>
  );
}
