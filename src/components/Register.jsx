import React, { useState } from 'react';
import { Button, Card, Typography, Divider, Input, Form, message } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import logo from '../assets/react.svg'; // Update path to your logo
import { useNavigate } from 'react-router-dom';
import '../styles/register.css'; // Import external CSS for custom styles

const { Title, Text } = Typography;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      message.success('Successfully signed up with email!');
      navigate('/home'); // Navigate to Home on successful signup
    } catch (error) {
      message.error('Failed to sign up with email.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <Card className="card">
        {/* Logo */}
        <img src={logo} alt="Logo" className="logo" />

        {/* Title */}
        <Title level={3}>Register</Title>

        {/* Join the revolution text */}
        <Text type="secondary" style={{ display: 'block', marginBottom: 10 }}>
          Join the revolution
        </Text>

        {/* Divider Line */}
        <Divider />

        {/* Email and Password Input */}
        <Form layout="vertical" onFinish={handleEmailSignUp}>
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
              Sign up with Email
            </Button>
          </Form.Item>
        </Form>

        {/* Already have an account? Log in */}
        <Text type="secondary" style={{ display: 'block', marginBottom: 10 }}>
          Already have an account?{' '}
          <Button
            type="link"
            onClick={() => navigate('/login')}
            style={{ padding: 0, fontWeight: 'bold' }}
          >
            Log in
          </Button>
        </Text>
      </Card>
    </div>
  );
};

export default Register;
