import React, { useEffect, useState } from 'react';
import { Button, Table, Input } from 'antd';
import { AuthApi } from '../../api/auth.api.cli';
import { UserModel, UserStatus } from '../../shared.lib/user-model';
import { ChangeStatusPayload } from '../../shared.lib/api/auth.api';
import { useNavigate } from 'react-router-dom';
import { AppSettig } from '../../app.setting';

const AdminPanel = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()
  
  const getAllUsers = async () => {
    try {
      const users = await AuthApi.getAllUsers();
      const filtered = users.filter(user => user.role === "user" && user.email.includes(searchQuery));
      setUsers(filtered);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [searchQuery]);

  const handleBlockUser = async (userId: number) => {
    try {
      const newStatusPayload: ChangeStatusPayload = {
        id: userId,
        status: UserStatus.Block
      };
      await AuthApi.changeStatus(newStatusPayload);

      getAllUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      const newStatusPayload: ChangeStatusPayload = {
        id: userId,
        status: UserStatus.Active
      };
      await AuthApi.changeStatus(newStatusPayload);

      getAllUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenAnalytics = (id:number) => {
   navigate(`/analytics?userId=${id}`)
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      // sorter: (a:any, b:any) => a.name.length - b.name.length,
      // sortDirections: ['descend'],
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',

    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => {
        return status === UserStatus.Active ? 'Active' : 'Blocked';
      },
    },{
      title: 'Analytics',
      key: 'analytics',
      render: ( user: UserModel) => {
        return (
          <span>
            {user ? (
              <Button onClick={() => handleOpenAnalytics(user.id)}>Open</Button>
            ) : (
              <></>
            )}
          </span>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, user: UserModel) => {
        return (
          <span>
            {user && user.status === UserStatus.Active ? (
              <Button onClick={() => handleBlockUser(user.id)}>Block</Button>
            ) : (

              <Button onClick={() => handleUnblockUser(user.id)}>Unblock</Button>
            
            )}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <div>
        <Input.Search
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ width: '40%', margin: '5px' }}
          placeholder="Search by email"
        />

      </div>
      <Table dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
};

export default AdminPanel;
