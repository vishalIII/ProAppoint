import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertSlice';
import axios from '../../utils/axios';
import Layout from '../../components/Layout';
import { Table } from 'antd';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const dispatch = useDispatch();

    const getUsersData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/admin/get-all-doctors', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                setDoctors(response.data.data);
            } else {
                console.error('Failed to fetch Professionals:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching Professionals:', error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const changeStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/admin/change-doctor-status', {
                doctorId: record._id,
                userId: record.userId,
                status: status
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                setDoctors(doctors.map(doc => doc._id === record._id ? { ...doc, status } : doc));
            } else {
                console.error('Failed to change status:', response.data.message);
            }
        } catch (error) {
            console.error('Error changing status:', error);
        } finally {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getUsersData();
    }, []);

    const columns = [
        {
            title: "Name",
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className='d-flex'>
                    <h1 className='anchor'>{record.firstName} {record.lastName}</h1>
                </div>
            )
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phone'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === 'pending' && (
                        <h1 
                            className='anchor cursor-pointer underline'
                            onClick={() => changeStatus(record, "approved")}
                        >
                            Approve
                        </h1>
                    )}
                    {record.status === 'approved' && (
                        <h1 
                            className='anchor cursor-pointer underline'
                            onClick={() => changeStatus(record, "blocked")}
                        >
                            Block
                        </h1>
                    )}
                    {record.status === 'blocked' && (
                        <h1 
                            className='anchor cursor-pointer underline'
                            onClick={() => changeStatus(record, "approved")}
                        >
                            Approve
                        </h1>
                    )}
                </div>
            )
        }
    ];

    return (
        <Layout>
            <h1 className='page-header mb-3 text-center'>Doctors List</h1>
            <Table columns={columns} dataSource={doctors.map(doctor => ({ ...doctor, key: doctor._id }))} />
        </Layout>
    );
};

export default DoctorList;
