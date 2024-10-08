import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { db } from '../components/firebase'; // Adjust this import path

const GameUploadForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Add the uploadDate field along with other game data
      const gameData = {
        ...values,
        uploadDate: new Date(),
      };

      await addDoc(collection(db, 'Games'), gameData);
      message.success('Game uploaded successfully!');
      form.resetFields();
    } catch (error) {
      console.error('Error adding document: ', error);
      message.error('Failed to upload game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'white'}}>Upload Game</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Game Name"
          rules={[{ required: true, message: 'Please input the game name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="link"
          label="Game Link"
          rules={[
            { required: true, message: 'Please input the game link!' },
            { type: 'url', message: 'Please enter a valid URL!' }
          ]}
        
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Image URL"
          rules={[
            { required: true, message: 'Please input the image URL!' },
            { type: 'url', message: 'Please enter a valid URL!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Game Description"
          rules={[{ required: true, message: 'Please input the game description!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="rating"
          label="Rating"
          rules={[{ required: true, message: 'Please input the rating!' }]}
        >
          <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Upload Game
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GameUploadForm;
