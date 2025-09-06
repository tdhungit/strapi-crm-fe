import { useRequest } from 'ahooks';
import { Col, Input, Row, Select, Space } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';

interface AddressValue {
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  address?: string;
}

interface Props {
  value?: AddressValue;
  initialValues?: AddressValue;
  onChange?: (value: any) => void;
}

export default function AddressInput(props: Props): React.ReactElement {
  const [value, setValue] = useState<AddressValue>(props.value || {});

  useEffect(() => {
    if (props.initialValues) {
      setValue(props.initialValues);
      props.onChange?.({
        country: props.initialValues.country,
        state: props.initialValues.state,
        city: props.initialValues.city,
        zipcode: props.initialValues.zipcode,
        address: props.initialValues.address,
      });
    }
  }, [props.initialValues]);

  const { data: countries, loading: countryLoading } = useRequest(
    () => ApiService.request('get', '/address/countries'),
    {}
  );

  const {
    data: states,
    loading: stateLoading,
    run: loadStates,
  } = useRequest(
    (country: string) =>
      ApiService.request('get', `/address/countries/${country}/states`, {
        country: country,
      }),
    {
      manual: true,
    }
  );

  const {
    data: cities,
    loading: cityLoading,
    run: loadCities,
  } = useRequest(
    (state: string) =>
      ApiService.request('get', `/address/states/${state}/cities`),
    {
      manual: true,
    }
  );

  // Load states when component mounts and country is already selected
  useEffect(() => {
    if (value.country) {
      loadStates(value.country);
    }
  }, [value.country, loadStates]);

  // Load cities when component mounts and state is already selected
  useEffect(() => {
    if (value.state && value.country) {
      loadCities(value.state);
    }
  }, [value.state, loadCities]);

  const handleChange = (field: keyof AddressValue, fieldValue: string) => {
    const newValue = { ...value, [field]: fieldValue };

    // Clear dependent fields when parent changes
    if (field === 'country') {
      newValue.state = undefined;
      newValue.city = undefined;
      if (fieldValue) {
        loadStates(fieldValue);
      }
    } else if (field === 'state') {
      newValue.city = undefined;
      if (fieldValue) {
        loadCities(fieldValue);
      }
    }

    setValue({
      country: newValue.country,
      state: newValue.state,
      city: newValue.city,
      zipcode: newValue.zipcode,
      address: newValue.address,
    });
    props.onChange?.(newValue);
  };

  return (
    <Space direction='vertical' size='middle' style={{ width: '100%' }}>
      {/* First Row - Country and State */}
      <Row gutter={16}>
        <Col span={12}>
          <Select
            placeholder='Search and select country'
            loading={countryLoading}
            value={value.country}
            onChange={(countryValue) => handleChange('country', countryValue)}
            showSearch
            allowClear
            filterOption={(input, option) =>
              option?.children
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase()) || false
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '')
                .toString()
                .toLowerCase()
                .localeCompare(
                  (optionB?.children ?? '').toString().toLowerCase()
                )
            }
            style={{ width: '100%' }}
            size='middle'
            notFoundContent={
              countryLoading ? 'Loading...' : 'No countries found'
            }
          >
            {countries?.map((country: any) => (
              <Select.Option key={country.id} value={country.name}>
                {country.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Select
            placeholder='Search and select state'
            loading={stateLoading}
            value={value.state}
            onChange={(stateValue) => handleChange('state', stateValue)}
            disabled={!value.country}
            showSearch
            allowClear
            filterOption={(input, option) =>
              option?.children
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase()) || false
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '')
                .toString()
                .toLowerCase()
                .localeCompare(
                  (optionB?.children ?? '').toString().toLowerCase()
                )
            }
            style={{ width: '100%' }}
            size='middle'
            notFoundContent={
              !value.country
                ? 'Please select a country first'
                : stateLoading
                ? 'Loading...'
                : 'No states found'
            }
          >
            {states?.map((state: any) => (
              <Select.Option key={state.id} value={state.name}>
                {state.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      {/* Second Row - City and Zipcode */}
      <Row gutter={16}>
        <Col span={12}>
          <Select
            placeholder='Search and select city'
            loading={cityLoading}
            value={value.city}
            onChange={(cityValue) => handleChange('city', cityValue)}
            disabled={!value.state}
            showSearch
            allowClear
            filterOption={(input, option) =>
              option?.children
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase()) || false
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '')
                .toString()
                .toLowerCase()
                .localeCompare(
                  (optionB?.children ?? '').toString().toLowerCase()
                )
            }
            style={{ width: '100%' }}
            size='middle'
            notFoundContent={
              !value.state
                ? 'Please select a state first'
                : cityLoading
                ? 'Loading...'
                : 'No cities found'
            }
          >
            {cities?.map((city: any) => (
              <Select.Option key={city.id} value={city.name}>
                {city.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Input
            placeholder='Enter zipcode'
            value={value.zipcode}
            onChange={(e) => handleChange('zipcode', e.target.value)}
            style={{ width: '100%' }}
            size='middle'
            allowClear
          />
        </Col>
      </Row>

      {/* Third Row - Full Address */}
      <Row>
        <Col span={24}>
          <Input
            placeholder='Enter detailed address'
            value={value.address}
            onChange={(e) => handleChange('address', e.target.value)}
            style={{ width: '100%' }}
            allowClear
          />
        </Col>
      </Row>
    </Space>
  );
}
