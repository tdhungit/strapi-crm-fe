import { PlusOutlined } from '@ant-design/icons';
import { Flex, Input, Tag, type InputRef } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ApiService from '../../../services/ApiService';
import TagFindRecordsModal from './TagFindRecordsModal';

interface ValueType {
  id: number;
  documentId: string;
  name: string;
}

export default function TagInput({
  module,
  recordId,
}: {
  module: string;
  recordId: string;
}) {
  const [value, setValue] = useState<ValueType[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputId, setEditInputId] = useState(0);
  const [editInputValue, setEditInputValue] = useState('');

  const [tagSelected, setTagSelected] = useState<ValueType | null>(null);
  const [tagFindRecordsModalOpen, setTagFindRecordsModalOpen] = useState(false);

  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  const loadTags = () => {
    ApiService.request('GET', `/tags/${module}/${recordId}`).then((res) => {
      setValue(res);
    });
  };

  useEffect(() => {
    loadTags();
  }, [module, recordId]);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleSave = (tags: ValueType[]) => {
    ApiService.request('POST', '/tags/assign', {
      module,
      recordId,
      tagNames: tags.map((v) => v.name),
    }).then(() => {
      loadTags();
    });
  };

  const handleClose = (removedTagId: number) => {
    const newTags = value.filter((tag) => tag.id !== removedTagId);
    setValue(newTags);
    handleSave(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !value.map((v) => v.name).includes(inputValue)) {
      setValue([
        ...value,
        { id: value.length + 1, documentId: recordId, name: inputValue },
      ]);
      handleSave([
        ...value,
        { id: value.length + 1, documentId: recordId, name: inputValue },
      ]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...value];
    const index = newTags.findIndex((v) => v.id === editInputId);
    newTags[index].name = editInputValue;
    setValue(newTags);
    setEditInputId(0);
    setEditInputValue('');
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    borderStyle: 'dashed',
  };

  const tagInputStyle: React.CSSProperties = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: 'top',
  };

  return (
    <>
      <Flex gap='4px 0' wrap>
        {value.map((item: ValueType) => (
          <>
            {editInputId === item.id ? (
              <Input
                ref={editInputRef}
                key={item.id}
                size='small'
                style={tagInputStyle}
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
              />
            ) : (
              <Tag
                key={item.id}
                closable
                onClose={() => handleClose(item.id)}
                onClick={() => {
                  setTagSelected(item);
                  setTagFindRecordsModalOpen(true);
                }}
              >
                <span
                  onDoubleClick={(e) => {
                    if (item.id !== 0) {
                      setEditInputId(item.id);
                      setEditInputValue(item.name);
                      e.preventDefault();
                    }
                  }}
                >
                  {item.name}
                </span>
              </Tag>
            )}
          </>
        ))}

        {inputVisible ? (
          <Input
            ref={inputRef}
            type='text'
            size='small'
            style={tagInputStyle}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
            New Tag
          </Tag>
        )}
      </Flex>

      {tagSelected && (
        <TagFindRecordsModal
          open={tagFindRecordsModalOpen}
          onOpenChange={setTagFindRecordsModalOpen}
          tagId={tagSelected?.id}
        />
      )}
    </>
  );
}
