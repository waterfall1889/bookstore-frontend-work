import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const onSearch = (value, _e, info) =>
    console.log(info?.source, value);

const SearchBox = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <Search
            placeholder="输入书名、作者、编号以查询书籍"
            onSearch={onSearch}
            enterButton
            style={{ width: 600 }}
        />
    </div>
);

export default SearchBox;
