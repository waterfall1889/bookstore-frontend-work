import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Upload, message, Modal, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addBook } from '../../service/addBookService';
import { uploadImage } from '../../service/uploadImageService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AddBookCard = () => {
    const [form] = Form.useForm();
    const [coverImage, setCoverImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [jsonPreviewVisible, setJsonPreviewVisible] = useState(false);
    const [jsonData, setJsonData] = useState('');

    const handleImageUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片文件!');
            return false;
        }
        
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过 2MB!');
            return false;
        }
        
        setCoverImage(file);
        return false; // 手动处理上传
    };

    const showJsonPreview = async (values) => {
        try {
            // 如果有图片，先上传图片获取URL
            let coverUrl = '';
            if (coverImage) {
                message.loading('正在上传图片...', 0);
                coverUrl = await uploadImage(coverImage, values.id);
                message.destroy();
            }

            // 准备发送给后端的数据
            const bookData = {
                itemId: values.id,
                itemName: values.name,
                price: values.price,
                publish: values.publisher,
                author: values.author,
                remainNumber: values.stock,
                isbn: values.isbn,
                coverUrl: coverUrl,
                description: values.description
            };

            // 格式化 JSON 数据用于显示
            const formattedJson = JSON.stringify(bookData, null, 2);
            setJsonData(formattedJson);
            setJsonPreviewVisible(true);
            
        } catch (error) {
            message.error('准备数据失败：' + error.message);
        }
    };

    const handleConfirmSubmit = async () => {
        try {
            setSubmitting(true);
            setJsonPreviewVisible(false);
            
            // 解析 JSON 数据
            const bookData = JSON.parse(jsonData);
            
            // 打印即将发送的数据（格式化 JSON）
            console.log(
                "即将发送给后端的JSON数据：\n" +
                JSON.stringify(bookData, null, 2)
            );
            
            // 发送图书数据
            message.loading('正在添加图书...', 0);
            await addBook(bookData);
            message.destroy();
            
            message.success('图书添加成功！');
            form.resetFields();
            setCoverImage(null);
            
        } catch (error) {
            message.destroy();
            message.error('添加图书失败：' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const onFinish = (values) => {
        showJsonPreview(values);
    };

    return (
        <>
            <Card
                title={<Title level={4}>添加新书籍</Title>}
                style={{ maxWidth: 600, margin: '20px auto' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ stock: 0 }}
                >
                    {/* 书籍ID */}
                    <Form.Item
                        label="书籍ID"
                        name="id"
                        rules={[
                            { required: true, message: '请输入书籍ID' },
                            { pattern: /^\d{9}$/, message: 'ID必须是9位数字' }
                        ]}
                    >
                        <Input placeholder="请输入9位数字ID" maxLength={9} />
                    </Form.Item>

                    {/* 书名 */}
                    <Form.Item
                        label="书名"
                        name="name"
                        rules={[
                            { required: true, message: '请输入书名' },
                            { max: 40, message: '书名不能超过40字' }
                        ]}
                    >
                        <Input placeholder="请输入书名（不超过40字）" />
                    </Form.Item>

                    {/* 价格 */}
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
                        <InputNumber
                            min={0}
                            step={0.01}
                            style={{ width: '100%' }}
                            placeholder="请输入价格"
                        />
                    </Form.Item>

                    {/* 出版社 */}
                    <Form.Item
                        label="出版社"
                        name="publisher"
                        rules={[
                            { required: true, message: '请输入出版社' },
                            { max: 30, message: '出版社名称不能超过30字' }
                        ]}
                    >
                        <Input placeholder="请输入出版社（不超过30字）" />
                    </Form.Item>

                    {/* 作者 */}
                    <Form.Item
                        label="作者"
                        name="author"
                        rules={[
                            { required: true, message: '请输入作者' },
                            { max: 20, message: '作者姓名不能超过20字' }
                        ]}
                    >
                        <Input placeholder="请输入作者（不超过20字）" />
                    </Form.Item>

                    {/* 库存 */}
                    <Form.Item
                        label="库存"
                        name="stock"
                        rules={[
                            { required: true, message: '请输入库存数量' },
                            {
                                type: 'integer',
                                min: 0,
                                message: '库存必须是不小于0的整数'
                            }
                        ]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    {/* ISBN */}
                    <Form.Item
                        label="ISBN"
                        name="isbn"
                        rules={[
                            { required: true, message: '请输入ISBN' },
                            { pattern: /^[\d-]{17}$/, message: 'ISBN必须是17位字符' }
                        ]}
                    >
                        <Input placeholder="请输入17位ISBN" maxLength={17} />
                    </Form.Item>

                    {/* 介绍 */}
                    <Form.Item
                        label="书籍介绍"
                        name="description"
                        rules={[
                            { required: true, message: '请输入书籍介绍' },
                            { max: 300, message: '介绍不能超过300字' }
                        ]}
                    >
                        <TextArea rows={4} placeholder="请输入书籍介绍（不超过300字）" />
                    </Form.Item>

                    {/* 封面 */}
                    <Form.Item
                        label="书籍封面"
                        extra={
                            <div>
                                <Text type="secondary">支持JPG/PNG格式图片，大小不超过2MB</Text>
                            </div>
                        }
                    >
                        <Upload
                            accept="image/*"
                            beforeUpload={handleImageUpload}
                            listType="picture-card"
                            showUploadList={false}
                        >
                            {coverImage ? (
                                <img
                                    src={URL.createObjectURL(coverImage)}
                                    alt="封面预览"
                                    style={{ width: '100%' }}
                                />
                            ) : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>上传封面</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            loading={submitting}
                        >
                            {submitting ? '添加中...' : '预览并提交'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* JSON 预览模态框 */}
            <Modal
                title="书籍数据预览"
                open={jsonPreviewVisible}
                onOk={handleConfirmSubmit}
                onCancel={() => setJsonPreviewVisible(false)}
                okText="确认提交"
                cancelText="取消"
                width={800}
                confirmLoading={submitting}
            >
                <div style={{ marginBottom: 16 }}>
                    <Text strong>以下是将要发送添加的书籍数据：</Text>
                </div>
                <TextArea
                    value={jsonData}
                    rows={15}
                    style={{ 
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        backgroundColor: '#f5f5f5'
                    }}
                    readOnly
                />
            </Modal>
        </>
    );
};

export default AddBookCard;