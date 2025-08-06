'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import analyticsData from '../data/analyticsData.json';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AnalyticsCharts = () => {
  // Chart options with dark theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#E5E7EB',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#E5E7EB',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  // Revenue Bar Chart Data
  const revenueBarData = {
    labels: analyticsData.revenue.monthly.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: analyticsData.revenue.monthly.map(item => item.value),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Subscription Pie Chart Data
  const subscriptionPieData = {
    labels: analyticsData.subscriptionBreakdown.map(item => item.plan),
    datasets: [
      {
        data: analyticsData.subscriptionBreakdown.map(item => item.users),
        backgroundColor: analyticsData.subscriptionBreakdown.map(item => item.color),
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  // User Engagement Line Chart Data
  const engagementLineData = {
    labels: analyticsData.userEngagement.byFeature.map(item => item.feature),
    datasets: [
      {
        label: 'Usage %',
        data: analyticsData.userEngagement.byFeature.map(item => item.usage),
        borderColor: 'rgba(6, 182, 212, 1)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Satisfaction (1-5)',
        data: analyticsData.userEngagement.byFeature.map(item => item.satisfaction * 20), // Scale to match usage
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Geographic Treemap-style Component
  const GeographicTreemap = () => {
    const maxRevenue = Math.max(...analyticsData.geographicData.map(item => item.revenue));
    
    return (
      <div className="grid grid-cols-4 gap-2 h-64">
        {analyticsData.geographicData.map((region) => {
          const intensity = (region.revenue / maxRevenue) * 100;
          const size = region.size;
          
          return (
            <div
              key={region.region}
              className={`
                bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-3 flex flex-col justify-between
                hover:scale-105 transition-transform cursor-pointer
                ${size > 20 ? 'col-span-2 row-span-2' : size > 15 ? 'col-span-2' : size > 10 ? 'row-span-2' : ''}
              `}
              style={{
                opacity: 0.3 + (intensity / 100) * 0.7,
              }}
              title={`${region.region}: ${region.users} users, $${region.revenue.toLocaleString()}`}
            >
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">{region.region}</h4>
                <p className="text-white/80 text-xs">{region.users} users</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">${(region.revenue / 1000).toFixed(1)}k</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Activity Heatmap Component
  const ActivityHeatmap = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hours = [9, 10, 11, 14, 15];
    
    const getActivityLevel = (day: string, hour: number) => {
      const data = analyticsData.userEngagement.heatmapData.find(
        item => item.day === day && item.hour === hour
      );
      return data ? data.activity : 0;
    };

    const getHeatmapColor = (activity: number) => {
      if (activity >= 90) return 'bg-green-500';
      if (activity >= 80) return 'bg-green-400';
      if (activity >= 70) return 'bg-yellow-400';
      if (activity >= 60) return 'bg-orange-400';
      return 'bg-red-400';
    };

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-6 gap-1 text-xs text-gray-300">
          <div></div>
          {hours.map(hour => (
            <div key={hour} className="text-center">{hour}:00</div>
          ))}
        </div>
        {days.map(day => (
          <div key={day} className="grid grid-cols-6 gap-1">
            <div className="text-xs text-gray-300 pr-2 text-right">{day.slice(0, 3)}</div>
            {hours.map(hour => {
              const activity = getActivityLevel(day, hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`h-8 rounded ${getHeatmapColor(activity)} flex items-center justify-center text-xs text-white font-medium hover:scale-110 transition-transform cursor-pointer`}
                  title={`${day} ${hour}:00 - ${activity}% activity`}
                >
                  {activity}
                </div>
              );
            })}
          </div>
        ))}
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 mt-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>Low (60-69%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span>Medium (70-89%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>High (90%+)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Revenue Trends */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white text-xl font-semibold mb-4">📊 Monthly Revenue Trends</h3>
        <div className="h-64">
          <Bar data={revenueBarData} options={chartOptions} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Subscription Breakdown */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">🥧 Subscription Plans</h3>
          <div className="h-64">
            <Pie 
              data={subscriptionPieData} 
              options={{
                ...chartOptions,
                scales: undefined // Remove scales for pie chart
              }} 
            />
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">📈 Feature Engagement</h3>
          <div className="h-64">
            <Line data={engagementLineData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Geographic Distribution (Treemap-style) */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white text-xl font-semibold mb-4">🗺️ Geographic Revenue Distribution</h3>
        <p className="text-gray-300 text-sm mb-4">Size represents user count, opacity represents revenue intensity</p>
        <GeographicTreemap />
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white text-xl font-semibold mb-4">🔥 User Activity Heatmap</h3>
        <p className="text-gray-300 text-sm mb-4">Peak activity hours throughout the week</p>
        <ActivityHeatmap />
      </div>

      {/* Performance Metrics Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white text-xl font-semibold mb-4">🎯 Conversion Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-gray-300 font-medium py-3 px-4">Traffic Source</th>
                <th className="text-gray-300 font-medium py-3 px-4">Visitors</th>
                <th className="text-gray-300 font-medium py-3 px-4">Conversions</th>
                <th className="text-gray-300 font-medium py-3 px-4">Rate</th>
                <th className="text-gray-300 font-medium py-3 px-4">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.performanceMetrics.conversionRates.map((metric, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="text-white py-3 px-4 font-medium">{metric.source}</td>
                  <td className="text-gray-300 py-3 px-4">{metric.visitors.toLocaleString()}</td>
                  <td className="text-gray-300 py-3 px-4">{metric.conversions}</td>
                  <td className="text-white py-3 px-4 font-semibold">{metric.rate}%</td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(metric.rate / 5) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;