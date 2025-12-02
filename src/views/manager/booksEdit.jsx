import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Upload, message, Spin, Card, Typography, Tag, Select, Space, Divider } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { fetchBook } from '../../service/bookcardService';
import { updateBook } from '../../service/updateBookService';
import { uploadImage } from '../../service/uploadImageService';
import { fetchBookDescription } from '../../service/bookDescriptionService';
import { getBookTags, updateBookTags, getAllTags, addTagToBook, removeTagFromBook } from '../../service/BookTagService';
import ManagerLayout from "../../components/manager_layout";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const BooksEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [coverImage, setCoverImage] = useState(null);
    const [book, setBook] = useState(null);
    const [bookTags, setBookTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [tagsLoading, setTagsLoading] = useState(false);

    useEffect(() => {
        async function loadBook() {
            try {
                setLoading(true);
                const data = await fetchBook(id);
                const descData = await fetchBookDescription(id);
                let description = '';
                if (descData && typeof descData === 'object' && descData.description) {
                    description = descData.description;
                } else if (typeof descData === 'string') {
                    description = descData;
                }
                setBook(data);
                form.setFieldsValue({
                    id: data.itemId,
                    name: data.itemName,
                    price: data.price,
                    publisher: data.publish,
                    author: data.author,
                    stock: data.remainNumber,
                    isbn: data.isbn,
                    description: description,
                    validness: data.validness,
                });
                
                // 加载图书标签
                await loadBookTags(id);
                // 加载所有可用标签
                await loadAllTags();
            } catch (error) {
                message.error('加载图书信息失败');
            } finally {
                setLoading(false);
            }
        }
        loadBook();
    }, [id, form]);

    const loadBookTags = async (bookId) => {
        try {
            const tags = await getBookTags(bookId);
            setBookTags(tags || []);
        } catch (error) {
            console.error('加载图书标签失败:', error);
            setBookTags([]);
        }
    };

    const loadAllTags = async () => {
        try {
            setTagsLoading(true);
            const tags = await getAllTags();
            setAllTags(tags || []);
        } catch (error) {
            console.error('加载所有标签失败:', error);
            setAllTags([]);
        } finally {
            setTagsLoading(false);
        }
    };

    const handleAddTag = async (tagName) => {
        if (!tagName || bookTags.some(t => t.tagName === tagName)) {
            return;
        }
        try {
            await addTagToBook(id, tagName);
            await loadBookTags(id);
            message.success('标签添加成功');
        } catch (error) {
            message.error('添加标签失败：' + error.message);
        }
    };

    const handleRemoveTag = async (tagName) => {
        try {
            await removeTagFromBook(id, tagName);
            await loadBookTags(id);
            message.success('标签移除成功');
        } catch (error) {
            message.error('移除标签失败：' + error.message);
        }
    };

    const handleSaveTags = async () => {
        try {
            const tagNames = bookTags.map(t => t.tagName);
            await updateBookTags(id, tagNames);
            message.success('标签保存成功');
        } catch (error) {
            message.error('保存标签失败：' + error.message);
        }
    };

    const handleImageUpload = (file) => {
        console.log('选择了新封面图片:', file.name, '预览URL:', URL.createObjectURL(file));
        setCoverImage(file);
        return false;
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            let coverUrl = book.coverUrl;
            if (coverImage) {
                coverUrl = await uploadImage(coverImage, values.id);
            }
            const updateData = {
                itemId: values.id,
                itemName: values.name,
                price: values.price,
                publish: values.publisher,
                author: values.author,
                remainNumber: values.stock,
                isbn: values.isbn,
                coverUrl,
                description: values.description,
                validness: values.validness !== undefined ? values.validness : book.validness,
            };
            await updateBook(updateData);
            message.success('图书信息修改成功');
            navigate('/manager/books');
        } catch (error) {
            message.error('修改失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spin style={{ margin: 100 }} />;
    }

    return (
        <ManagerLayout>
            <Card title={<Title level={4}>编辑图书信息</Title>} style={{ maxWidth: 600, margin: '20px auto' }}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="书籍ID"
                        name="id"
                        rules={[
                            { required: true, message: '请输入书籍ID' },
                            { pattern: /^\d{9}$/, message: '书籍ID必须为9位数字' }
                        ]}
                    >
                        <Input maxLength={9} />
                    </Form.Item>
                    <Form.Item
                        label="书名"
                        name="name"
                        rules={[
                            { required: true, message: '请输入书名' },
                            { max: 40, message: '书名不能超过40字' }
                        ]}
                    >
                        <Input maxLength={40} />
                    </Form.Item>
                    <Form.Item
                        label="作者"
                        name="author"
                        rules={[
                            { required: true, message: '请输入作者' },
                            { max: 20, message: '作者不能超过20字' }
                        ]}
                    >
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        label="库存"
                        name="stock"
                        rules={[
                            { required: true, message: '请输入库存数量' },
                            { type: 'integer', min: 0, message: '库存必须为大于等于0的整数' }
                        ]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="价格"
                        name="price"
                        rules={[
                            { required: true, message: '请输入价格' },
                            {
                                validator: (_, value) =>
                                    value && /^\d+(\.\d{1,2})?$/.test(value)
                                        ? Promise.resolve()
                                        : Promise.reject('价格格式不正确（最多两位小数）')
                            }
                        ]}
                    >
                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="出版社"
                        name="publisher"
                        rules={[
                            { required: true, message: '请输入出版社' },
                            { max: 30, message: '出版社不能超过30字' }
                        ]}
                    >
                        <Input maxLength={30} />
                    </Form.Item>
                    <Form.Item
                        label="ISBN"
                        name="isbn"
                        rules={[
                            { required: true, message: '请输入ISBN' },
                            { len: 17, message: 'ISBN必须为17个字符' }
                        ]}
                    >
                        <Input maxLength={17} />
                    </Form.Item>
                    <Form.Item
                        label="书籍介绍"
                        name="description"
                        rules={[
                            { required: true, message: '请输入介绍' }
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="封面图片">
                        <Upload
                            accept="image/*"
                            beforeUpload={handleImageUpload}
                            listType="picture-card"
                            showUploadList={false}
                        >
                            {coverImage ? (
                                <img src={URL.createObjectURL(coverImage)} alt="封面预览" style={{ width: '100%' }} />
                            ) : book.coverUrl ? (
                                <img src={book.coverUrl} alt="封面" style={{ width: '100%' }} />
                            ) : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>上传封面</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Divider>标签管理</Divider>
                    
                    <Form.Item label="图书标签">
                        <div style={{ marginBottom: 16 }}>
                            <Space wrap>
                                {bookTags.map(tag => (
                                    <Tag
                                        key={tag.tagId}
                                        closable
                                        onClose={() => handleRemoveTag(tag.tagName)}
                                        color="blue"
                                        style={{ fontSize: '14px', padding: '4px 12px' }}
                                    >
                                        {tag.tagName}
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                        <Space>
                            <Select
                                placeholder="选择标签添加"
                                style={{ width: 200 }}
                                loading={tagsLoading}
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onSelect={(value) => {
                                    handleAddTag(value);
                                }}
                                notFoundContent={tagsLoading ? <Spin size="small" /> : '无可用标签'}
                            >
                                {allTags
                                    .filter(tag => !bookTags.some(bt => bt.tagName === tag.tagName))
                                    .map(tag => (
                                        <Option key={tag.tagId} value={tag.tagName}>
                                            {tag.tagName}
                                        </Option>
                                    ))}
                            </Select>
                            <Button onClick={handleSaveTags} type="primary">
                                保存标签
                            </Button>
                        </Space>
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                                提示：点击标签上的 × 可移除标签，或从下拉列表中选择标签添加
                            </Text>
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            保存修改
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            danger
                            block
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    const values = form.getFieldsValue();
                                    let coverUrl = book.coverUrl;
                                    if (coverImage) {
                                        coverUrl = await uploadImage(coverImage, values.id);
                                    }
                                    const updateData = {
                                        itemId: values.id,
                                        itemName: values.name,
                                        price: values.price,
                                        publish: values.publisher,
                                        author: values.author,
                                        remainNumber: values.stock,
                                        isbn: values.isbn,
                                        coverUrl,
                                        description: values.description,
                                        validness: 0,
                                    };
                                    await updateBook(updateData);
                                    message.success('图书已下架');
                                    navigate('/manager/books');
                                } catch (error) {
                                    message.error('下架失败：' + error.message);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            下架
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </ManagerLayout>
    );
};

export default BooksEdit; 