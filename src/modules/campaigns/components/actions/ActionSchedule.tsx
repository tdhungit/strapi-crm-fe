import {
  ProCard,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useState } from 'react';

export default function ActionSchedule() {
  const [scheduleType, setScheduleType] = useState<string>('');

  return (
    <ProCard bordered>
      <ProFormSelect
        label='Schedule Type'
        name={['schedule', 'type']}
        options={[
          { label: 'Elapsed Day', value: 'elapsed_day' },
          { label: 'Exact Date', value: 'exact_date' },
        ]}
        onChange={(value: string) => {
          setScheduleType(value);
        }}
      />

      <Row gutter={16}>
        {scheduleType === 'exact_date' && (
          <Col span={8}>
            <ProFormDatePicker label='Date' name={['schedule', 'date']} />
          </Col>
        )}

        <Col span={scheduleType === 'exact_date' ? 8 : 12}>
          <ProFormDigit
            label='Hours'
            name={['schedule', 'hours']}
            min={0}
            max={23}
          />
        </Col>

        <Col span={scheduleType === 'exact_date' ? 8 : 12}>
          <ProFormDigit
            label='Minutes'
            name={['schedule', 'minutes']}
            min={0}
            max={59}
          />
        </Col>
      </Row>
    </ProCard>
  );
}
