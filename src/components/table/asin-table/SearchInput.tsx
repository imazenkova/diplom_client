import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import fuzzysort from 'fuzzysort';
import {
  CSSProperties,
  forwardRef,
  useImperativeHandle,
  useState
} from 'react';
import { ASINColumns } from '../asin-table-columns';

interface SearchInputProps {
  style?: CSSProperties;
  onValueChanged: (value: string) => void;
}

export interface SearchInputRef {
  reset: () => void;
}

type SearchInputComponent = React.ForwardRefExoticComponent<SearchInputProps & React.RefAttributes<SearchInputRef>> & {
  applyFilter: (value: string, dataSource: any[], columns: ASINColumns) => any[]
  isEmpty(value: string): boolean
};


const SearchInput = forwardRef<SearchInputRef, SearchInputProps>((props, ref) => {
  const { onValueChanged } = props;
  const [searchTimer, setSearchTimer] = useState<number | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string>('');

  useImperativeHandle(ref, () => ({
    reset: () => setInputValue(''),
  }));

  const handleChange = (value: string) => {
    if (searchTimer !== undefined) window.clearTimeout(searchTimer);
    const localSearchTimer = window.setTimeout(() => {
      const newValue = value;
      if (!newValue) {
        onValueChanged('');
      } else {
        onValueChanged(newValue)
      }
    }, 500);

    setSearchTimer(localSearchTimer);
  };

  return (
    <Input
      value={inputValue}
      suffix={<SearchOutlined />}
      size='small'
      onChange={(e) => {
        setInputValue(e.target.value)
        handleChange(e.target.value)
      }}
    />
  );
}) as SearchInputComponent

// Добавление статической функции
SearchInput.applyFilter = (value: string, dataSource: any[], columns: ASINColumns): any[] => {
  const keys = columns.map((v) => v.field as string);

  const fsort = fuzzysort.go(value, dataSource, { keys }).map((v) => v.obj);
  return fsort

};

SearchInput.isEmpty = (value: string): boolean => {
  return !value
};


export default SearchInput;
