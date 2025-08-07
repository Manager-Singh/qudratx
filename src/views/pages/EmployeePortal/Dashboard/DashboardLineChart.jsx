// components/DashboardLineChart.js
import React from 'react'
import { CChartLine } from '@coreui/react-chartjs'

const DashboardLineChart = ({ data }) => {
  return (
    <CChartLine
      data={{
        labels: ['Proposals', 'Leads', 'Clients', 'Employees'],
        datasets: [
          {
            label: 'Dashboard Overview',
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: '#4bc0c0',
            pointBackgroundColor: '#4bc0c0',
            data: [
              data.totalProposals || 0,
              data.totalLeads || 0,
              data.totalClients || 0,
              data.totalEmployees || 0,
            ],
            fill: true,
            tension: 0.4,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }}
    />
  )
}

export default DashboardLineChart
