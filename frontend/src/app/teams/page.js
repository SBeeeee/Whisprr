"use client"
import {React,useState} from 'react'
import TeamsLandingPage from './components/TeamsLandingPage'
import PrivateRoute from '@/utils/Private'

function page() {
  
  return (
    <div>
      <PrivateRoute>
      <TeamsLandingPage/>
      </PrivateRoute>
    </div>
  )
}

export default page
