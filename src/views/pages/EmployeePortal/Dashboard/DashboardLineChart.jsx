// components/DashboardLineChart.js
import React from 'react'
import { CChartLine } from '@coreui/react-chartjs'

const DashboardLineChart = ({ data }) => {
  // dummy fallback if no data passed
  const chartData =  {
    dates: ['2025-08-01', '2025-08-02', '2025-08-03', '2025-08-04', '2025-08-05', '2025-08-06', '2025-08-07'],
    proposals: [5, 3, 6, 7, 2, 4, 8],
    leads: [2, 4, 3, 5, 6, 3, 2],
    clients: [1, 0, 2, 1, 1, 2, 3],
    employees: [0, 1, 1, 0, 2, 1, 1],
  }

  return (
    <div >
      <CChartLine
      height={200}
        data={{
          labels: chartData.dates,
          datasets: [
            {
              label: 'Proposals',
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: '#4bc0c0',
              pointBackgroundColor: '#4bc0c0',
              data: chartData.proposals,
              fill: false,
              tension: 0.4,
            },
            {
              label: 'Leads',
              backgroundColor: 'rgba(255,206,86,0.2)',
              borderColor: '#ffce56',
              pointBackgroundColor: '#ffce56',
              data: chartData.leads,
              fill: false,
              tension: 0.4,
            },
            {
              label: 'Clients',
              backgroundColor: 'rgba(153,102,255,0.2)',
              borderColor: '#9966ff',
              pointBackgroundColor: '#9966ff',
              data: chartData.clients,
              fill: false,
              tension: 0.4,
            },
            {
              label: 'Employees',
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: '#ff6384',
              pointBackgroundColor: '#ff6384',
              data: chartData.employees,
              fill: false,
              tension: 0.4,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
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
    </div>
  )
}

export default DashboardLineChart
