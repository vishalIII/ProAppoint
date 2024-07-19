import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertSlice';
import Spinner from '../Spinner'; // Ensure Spinner component is imported

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    website: '',
    address: '',
    specialization: '',
    experience: '',
    feePerConsultation: '',
    fromTime: '',
    toTime: ''
  });
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.alerts.loading);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.post('/api/doctor/get-doctor-info-by-user-id', {
          userId: user._id
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          const data = response.data.data;
          setProfileData(data);
          setFormData({
            ...data,
            fromTime: convertTo12HourFormat(data.timings[0]?.fromTime || ''),
            toTime: convertTo12HourFormat(data.timings[0]?.toTime || '')
          });
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        dispatch(hideLoading());
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user, dispatch]);

  const convertTo12HourFormat = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.put('/api/doctor/update-doctor-info', {
        ...formData,
        timings: [{
          fromTime: formData.fromTime,
          toTime: formData.toTime
        }]
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profile</h1>
        {loading ? (
          <Spinner />
        ) : (
          profileData ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData).map(([key, value]) => (
                  key !== 'fromTime' && key !== 'toTime' && (
                    <div key={key} className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        id={key}
                        name={key}
                        type={key === 'email' ? 'email' : key === 'feePerConsultation' ? 'number' : 'text'}
                        value={value}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                  )
                ))}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fromTime">
                    From Time
                  </label>
                  <input
                    id="fromTime"
                    name="fromTime"
                    type="text"
                    value={formData.fromTime}
                    onChange={handleChange}
                    placeholder="e.g. 11:00 AM"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="toTime">
                    To Time
                  </label>
                  <input
                    id="toTime"
                    name="toTime"
                    type="text"
                    value={formData.toTime}
                    onChange={handleChange}
                    placeholder="e.g. 6:00 PM"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Update Profile
              </button>
            </form>
          ) : (
            <p className="text-gray-600">Loading profile data...</p>
          )
        )}
      </div>
    </Layout>
  );
};

export default Profile;
