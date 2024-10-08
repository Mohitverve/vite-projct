import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { Table, Statistic, Card } from 'antd';
import { BarChartOutlined, UsergroupAddOutlined, ShoppingCartOutlined, PlayCircleOutlined  } from '@ant-design/icons';
import { collection, getDocs, query, where, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../components/firebase';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [gamesListed, setGamesListed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalDeliveryPartners, setTotalDeliveryPartners] = useState(0);
  const [totalGamesBought, setTotalGamesBought] = useState(0);
  const [mostBoughtGame, setMostBoughtGame] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch Pending Requests
        const vClassRef = collection(db, 'VClassRequests');
        const q = query(vClassRef, where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingRequests(requests);

        // Fetch Completed Sessions
        const completedSessionsSnapshot = await getDocs(collection(db, 'CompletedSessions'));
        const completedSessionsData = completedSessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCompletedSessions(completedSessionsData);

        // Fetch total number of sessions
        const totalSessionsSnapshot = await getDocs(collection(db, 'VClassRequests'));
        setTotalSessions(totalSessionsSnapshot.size);

        // Fetch total number of delivery partners
        const deliveryPartnersSnapshot = await getDocs(collection(db, 'DeliveryPartners'));
        setTotalDeliveryPartners(deliveryPartnersSnapshot.size);

        // Fetch total number of games bought
        const gamePurchasesSnapshot = await getDocs(collection(db, 'GamePurchases'));
        setTotalGamesBought(gamePurchasesSnapshot.size);

        // Determine the most bought game
        const gameCounts = {};
        gamePurchasesSnapshot.forEach(doc => {
          const game = doc.data().gameName;
          if (game) {
            gameCounts[game] = (gameCounts[game] || 0) + 1;
          }
        });
        const mostBought = Object.keys(gameCounts).reduce((a, b) => (gameCounts[a] > gameCounts[b] ? a : b), '');
        setMostBoughtGame(mostBought);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up a real-time listener for the Games collection
    const gamesRef = collection(db, 'Games');
    const unsubscribe = onSnapshot(gamesRef, (snapshot) => {
      const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGamesListed(gamesData);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleMarkAsCompleted = async (id) => {
    try {
      const requestRef = doc(db, 'VClassRequests', id);
      await updateDoc(requestRef, { status: 'completed' });
      setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const columns = [
    { title: 'Organization Name', dataIndex: 'organizationName', key: 'organizationName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Contact', dataIndex: 'contact', key: 'contact' },
    { title: 'Slot Date', dataIndex: 'slotDate', key: 'slotDate', render: date => date.toDate().toLocaleString() },
    { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleMarkAsCompleted(record.id)}>
          Mark as Completed
        </Button>
      )
    }
  ];

  const completedColumns = [
    { title: 'Session Name', dataIndex: 'sessionName', key: 'sessionName' },
    { title: 'Completion Date', dataIndex: 'completionDate', key: 'completionDate', render: date => date.toDate().toLocaleString() },
  ];

  const gamesColumns = [
    { title: 'Game Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Rating', dataIndex: 'rating', key: 'rating' },
    { title: 'Upload Date', dataIndex: 'uploadDate', key: 'uploadDate', render: date => date?.toDate().toLocaleString() },
  ];

  return (
    <div className='admin-dashboard'>
      <Typography variant="h4" className="services-heading">
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <Statistic
              title="Total VR Sessions"
              value={totalSessions}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <Statistic
              title="Total Delivery Partners"
              value={totalDeliveryPartners}
              prefix={<UsergroupAddOutlined />}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <Statistic
              title="Total Games Bought"
              value={totalGamesBought}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <Statistic
              title="Most Bought Game"
              value={mostBoughtGame}
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" className="services-heading">
        Pending Requests
      </Typography>
      <Table dataSource={pendingRequests} columns={columns} loading={loading} rowKey="id" />

      <Typography variant="h5" className="services-heading">
        Completed Sessions
      </Typography>
      <Table dataSource={completedSessions} columns={completedColumns} rowKey="id" />

      <Typography variant="h5" className="services-heading">
        Total Games Listed
      </Typography>
      <Table dataSource={gamesListed} columns={gamesColumns} rowKey="id" />
    </div>
  );
};

export default AdminDashboard;
