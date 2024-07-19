import React from 'react';

const DoctorForm = ({ handleSubmit, handleChange, formData }) => {
  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl mb-6 font-semibold text-gray-800">Professional Registration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'First Name', name: 'firstName', type: 'text' },
            { label: 'Last Name', name: 'lastName', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone Number', name: 'phoneNumber', type: 'text' },
            { label: 'Website', name: 'website', type: 'text' },
            { label: 'Address', name:
                'address', type: 'text' },
                { label: 'Specialization', name: 'specialization', type: 'text' },
                { label: 'Experience', name: 'experience', type: 'text' },
                { label: 'Fee per Consultation', name: 'feePerConsultation', type: 'number' }
              ].map((field, index) => (
                <div className="mb-4" key={index}>
                  <label className="block text-gray-700 font-bold mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">From Time</label>
                <input
                  type="time"
                  name="fromTime"
                  value={formData.timings[0]?.fromTime || ''}
                  onChange={(e) => handleChange(e, 'timings', 0, 'fromTime')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">To Time</label>
                <input
                  type="time"
                  name="toTime"
                  value={formData.timings[0]?.toTime || ''}
                  onChange={(e) => handleChange(e, 'timings', 0, 'toTime')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
          </form>
        </div>
      );
    };
    
    export default DoctorForm;
    