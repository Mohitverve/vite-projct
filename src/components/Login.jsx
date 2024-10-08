// Login.js
import React, { useState } from 'react';
import { Button, Card, Typography, Divider, Input, Form, message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import logo from '../assets/react.svg'; // Update path to your logo
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; // Import external CSS for custom styles

const { Title, Text } = Typography;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success('Successfully logged in!');
      navigate('/home'); // Navigate to Home on successful login
    } catch (error) {
      message.error('Failed to log in.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <Card className="card">
        {/* Logo */}
        <img src={logo} alt="Logo" className="logo" />

        {/* Title */}
        <Title level={3}>Login</Title>

        {/* Welcome text */}
        <Text type="secondary" style={{ display: 'block', marginBottom: 10 }}>
          Welcome back!
        </Text>

        {/* Divider Line */}
        <Divider />

        {/* Email and Password Input */}
        <Form layout="vertical" onFinish={handleEmailLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: 10 }}>
              Log in with Email
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
