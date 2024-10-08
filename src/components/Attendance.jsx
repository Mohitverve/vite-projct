import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import dayjs from 'dayjs';
import '@fontsource/poppins';

const Attendance = () => {
  const [user, setUser] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);

  // Fetch user and attendance on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchAttendance(user.uid);
        fetchLeaves(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to mark attendance
  const markAttendance = async () => {
    if (user) {
      const attendanceDate = dayjs().format('YYYY-MM-DD');
      try {
        await addDoc(collection(db, 'attendance'), {
          userId: user.uid,
          userName: user.displayName || user.email, // Store display name or email
          date: attendanceDate,
          timestamp: new Date(),
        });
        fetchAttendance(user.uid);
      } catch (error) {
        console.error('Error marking attendance:', error);
      }
    }
  };

  // Function to mark leave
  const markLeave = async () => {
    if (user) {
      const leaveDate = dayjs().format('YYYY-MM-DD');
      try {
        await addDoc(collection(db, 'leaves'), {
          userId: user.uid,
          userName: user.displayName || user.email, // Store display name or email
          date: leaveDate,
          timestamp: new Date(),
        });
        fetchLeaves(user.uid);
      } catch (error) {
        console.error('Error marking leave:', error);
      }
    }
  };

  // Fetch attendance records
  const fetchAttendance = async (userId) => {
    const q = query(collection(db, 'attendance'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const records = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAttendanceRecords(records);
  };

  // Fetch leave records
  const fetchLeaves = async (userId) => {
    const q = query(collection(db, 'leaves'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const records = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLeaveRecords(records);
  };

  // Function to delete attendance log
  const deleteAttendance = async (id) => {
    try {
      await deleteDoc(doc(db, 'attendance', id));
      fetchAttendance(user.uid);
    } catch (error) {
      console.error('Error deleting attendance:', error);
    }
  };

  // Function to delete leave log
  const deleteLeave = async (id) => {
    try {
      await deleteDoc(doc(db, 'leaves', id));
      fetchLeaves(user.uid);
    } catch (error) {
      console.error('Error deleting leave:', error);
    }
  };

  return (
    <Container style={{ fontFamily: 'Poppins', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
      <Typography variant="h4" style={{ marginBottom: '20px', color: '#333' }}>Mark Your Attendance or Leave</Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={markAttendance} 
        style={{ marginRight: '10px', marginBottom: '20px' }}
      >
        Mark Attendance
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={markLeave} 
        style={{ marginBottom: '20px' }}
      >
        Mark Leave
      </Button>

      {/* Attendance Records */}
      <Typography variant="h6" style={{ marginBottom: '10px' }}>Attendance Records</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.userName}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{dayjs(record.timestamp.toDate()).format('MMMM D, YYYY, h:mm A')}</TableCell>
              <TableCell>
                <IconButton onClick={() => deleteAttendance(record.id)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Leave Records */}
      <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>Leave Records</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaveRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.userName}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{dayjs(record.timestamp.toDate()).format('MMMM D, YYYY, h:mm A')}</TableCell>
              <TableCell>
                <IconButton onClick={() => deleteLeave(record.id)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Attendance;
