import React, { useState } from 'react';
import axios from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertSlice';
import Layout from '../components/Layout';

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);
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
    timings: [{ fromTime: '', toTime: '' }]
  });
  const dispatch = useDispatch();

  const handleChange = (e, arrayName, index, field) => {
    if (arrayName) {
      const updatedArray = [...formData[arrayName]];
      updatedArray[index][field] = e.target.value;
      setFormData({ ...formData, [arrayName]: updatedArray });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/apply-doctor-account', {
        ...formData,
        userId: user._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        alert('Professional registered successfully');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error registering doctor:', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Apply Professional Account</h2>
          <form onSubmit={handleSubmit} method="POST">
            <div className="grid grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="website">
                  Website
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="website"
                  type="url"
                  placeholder="Enter your website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialization">
                  Specialization
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="specialization"
                  type="text"
                  placeholder="Enter your specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
                  Experience
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="experience"
                  type="text"
                  placeholder="Enter your experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feePerConsultation">
                  Fee Per Consultation
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="feePerConsultation"
                  type="number"
                  placeholder="Enter your fee per consultation"
                  name="feePerConsultation"
                  value={formData.feePerConsultation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Timings
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="time"
                    value={formData.timings[0].fromTime}
                    onChange={(e) => handleChange(e, 'timings', 0, 'fromTime')}
                    required
                  />
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="time"
                    value={formData.timings[0].toTime}
                    onChange={(e) => handleChange(e, 'timings', 0, 'toTime')}
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;
