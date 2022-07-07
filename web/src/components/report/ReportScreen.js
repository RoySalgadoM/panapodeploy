import React from 'react'
import { useLocation } from 'react-router-dom'
import { ProjectReports } from './components/ProjectReports'

export const ReportScreen = () => {
  const { state } = useLocation();
  console.log(state);

  return (
    <ProjectReports data={state.id} name={state.name} dateEnd ={state.end} dateStart ={state.start}/>
  )
}
