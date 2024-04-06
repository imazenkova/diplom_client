import { Input, Space } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Divider, Select } from 'antd';
import { useRef } from 'react';

let index = 0;

export const Test: React.FC = () => {
  const [items, setItems] = useState(['jack', 'lucy']);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      style={{ width: 50 }}
      placeholder="custom dropdown render"
      dropdownRender={(menu) => (
        <div>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 4px 4px' }}>
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Add item
            </Button>
          </Space>
        </div>
      )}
      popupMatchSelectWidth={false}

//      dropdownStyle={{ minWidth: '20rem' }}  // Добавьте эту строку
      options={items.map((item) => ({ label: item, value: item }))}
    />
  );
};

export default Test;
