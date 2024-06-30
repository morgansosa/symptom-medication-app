// client/src/components/Profile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const { username, email } = formData;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { 'x-auth-token': token },
        });

        setFormData({
          username: res.data.username,
          email: res.data.email,
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile data', err);
        setMessage('Failed to fetch profile data. Please try again.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/users/me', formData, {
        headers: { 'x-auth-token': token },
      });

      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      setMessage('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={username} onChange={onChange} required />
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={onChange} required />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
