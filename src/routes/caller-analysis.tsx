import React from 'react'
import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'

function CallerAnalysis() {
  return (
    <div className="min-h-screen content">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Caller Analysis</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Call Volume</h2>
            <div className="text-3xl font-bold text-blue-500">1,247</div>
            <p className="text-secondary mt-2">Total calls this month</p>
          </div>
          
          <div className="card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Conversion Rate</h2>
            <div className="text-3xl font-bold text-green-500">23.5%</div>
            <p className="text-secondary mt-2">Calls that converted</p>
          </div>
          
          <div className="card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Average Duration</h2>
            <div className="text-3xl font-bold text-purple-500">4:32</div>
            <p className="text-secondary mt-2">Minutes per call</p>
          </div>
        </div>

        <div className="mt-8 card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Call Analytics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blur rounded-lg">
              <div>
                <div className="font-medium">+1 (555) 123-4567</div>
                <div className="text-secondary text-sm">2 minutes ago</div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="labels px-2 py-1 rounded">Converted</span>
                <span className="text-green-500 font-medium">Duration: 5:23</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-blur rounded-lg">
              <div>
                <div className="font-medium">+1 (555) 987-6543</div>
                <div className="text-secondary text-sm">15 minutes ago</div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="labels px-2 py-1 rounded">Missed</span>
                <span className="text-red-500 font-medium">Duration: 0:00</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-blur rounded-lg">
              <div>
                <div className="font-medium">+1 (555) 456-7890</div>
                <div className="text-secondary text-sm">1 hour ago</div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="labels px-2 py-1 rounded">Completed</span>
                <span className="text-blue-500 font-medium">Duration: 3:45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/caller-analysis',
    component: CallerAnalysis,
    getParentRoute: () => parentRoute,
  })
