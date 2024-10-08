import React from 'react'
import GameUploadForm from './GameUploadForm'
import AdminDashboard from './AdminDashboard'
import AppHeader from './Header'

const Admin = () => {
  return (
    <div>
      <AppHeader/>
     <GameUploadForm/>
     <AdminDashboard/>
   
    </div>
  )
}

export default Admin
