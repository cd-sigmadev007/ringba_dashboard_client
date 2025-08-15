import type { CallData } from '../types'
import type { SelectOption } from '@/components/ui/FilterSelect.tsx'

// Mock data for caller analysis
// Helper to pick a random status
export const statusOptions: Array<SelectOption> = [
  {
    title: 'High-Quality Unbilled (Critical)',
    value: 'High-Quality Unbilled (Critical)',
  },
  { title: 'Chargeback Risk (Critical)', value: 'Chargeback Risk (Critical)' },
  { title: 'Wrong Appliance Category', value: 'Wrong Appliance Category' },
  {
    title: 'Wrong Pest Control Category',
    value: 'Wrong Pest Control Category',
  },
  { title: 'Short Call (<90s)', value: 'Short Call (<90s)' },
  { title: 'Buyer Hung Up', value: 'Buyer Hung Up' },
  { title: 'Immediate Hangup (<10s)', value: 'Immediate Hangup (<10s)' },
  { title: 'Competitor Mentioned', value: 'Competitor Mentioned' },
  { title: 'Booking Intent', value: 'Booking Intent' },
  { title: 'Warranty/Status Inquiry', value: 'Warranty/Status Inquiry' },
  { title: 'Positive Sentiment', value: 'Positive Sentiment' },
  { title: 'Negative Sentiment', value: 'Negative Sentiment' },
  { title: 'Repeat Customer', value: 'Repeat Customer' },
  { title: 'Technical Terms Used', value: 'Technical Terms Used' },
  { title: 'No Coverage (ZIP)', value: 'No Coverage (ZIP)' },
]


const randomStatus = (): Array<string> => {
// get multiple random statuses
  const statuses = statusOptions.map(option => option.value)
  const randomCount = Math.floor(Math.random() * statuses.length) + 1
  const randomStatuses = new Set<string>()
  while (randomStatuses.size < randomCount) {
    const randomIndex = Math.floor(Math.random() * statuses.length)
    randomStatuses.add(statuses[randomIndex])
  }
  return Array.from(randomStatuses)
}

// Mock data for caller analysis
export const callData: Array<CallData> = [
  {
    id: '1',
    callerId: '+12025550173',
    lastCall: 'Aug 05, 06:00:00 AM ET',
    duration: '03m 25s',
    lifetimeRevenue: 503.99,
    campaign: 'M A P',
    action: 'Post Control',
    status: randomStatus(),
  },
  {
    id: '2',
    callerId: '+16175550112',
    lastCall: 'Aug 05, 02:45:00 AM ET',
    duration: '05m 12s',
    lifetimeRevenue: 30.96,
    campaign: 'A',
    action: 'Chargeback Risk (Critical)',
    status: randomStatus(),
  },
  {
    id: '3',
    callerId: '+13055550199',
    lastCall: 'Aug 04, 10:20:00 PM ET',
    duration: '02m 45s',
    lifetimeRevenue: 290.45,
    campaign: 'A',
    action: 'Wrong Appliance Category',
    status: randomStatus(),
  },
  {
    id: '4',
    callerId: '+14155550147',
    lastCall: 'Aug 04, 05:00:00 PM ET',
    duration: '04m 05s',
    lifetimeRevenue: 110.95,
    campaign: 'M P',
    action: 'Wrong Pest Control Category',
    status: randomStatus(),
  },
  {
    id: '5',
    callerId: '+14045550133',
    lastCall: 'Aug 04, 10:30:00 AM ET',
    duration: '06m 13s',
    lifetimeRevenue: 201.0,
    campaign: 'M A P',
    action: 'Short Call (<90s)',
    status: randomStatus(),
  },
  {
    id: '6',
    callerId: '+13125550158',
    lastCall: 'Aug 03, 02:10:00 PM ET',
    duration: '05m 33s',
    lifetimeRevenue: 80.5,
    campaign: 'P',
    action: 'Buyer Hung Up',
    status: randomStatus(),
  },
  {
    id: '7',
    callerId: '+12125550184',
    lastCall: 'Aug 03, 09:00:00 AM ET',
    duration: '00m 05s',
    lifetimeRevenue: 0,
    campaign: 'M A P',
    action: 'Immediate Hangup (<10s)',
    status: randomStatus(),
  },
  {
    id: '8',
    callerId: '+17135550129',
    lastCall: 'Aug 02, 03:20:00 PM ET',
    duration: '01m 09s',
    lifetimeRevenue: 90.5,
    campaign: 'A P',
    action: 'Competitor Mentioned',
    status: randomStatus(),
  },
  {
    id: '9',
    callerId: '+18185550177',
    lastCall: 'Aug 02, 11:00:00 AM ET',
    duration: '03m 30s',
    lifetimeRevenue: 503.99,
    campaign: 'M A',
    action: 'Booking Intent',
    status: randomStatus(),
  },
  {
    id: '10',
    callerId: '+15125550136',
    lastCall: 'Aug 01, 04:00:00 PM ET',
    duration: '01m 02s',
    lifetimeRevenue: 708.2,
    campaign: 'M P',
    action: 'Warranty/Status Inquiry',
    status: randomStatus(),
  },
  {
    id: '11',
    callerId: '+19175550142',
    lastCall: 'Jul 31, 03:15:00 PM ET',
    duration: '04m 22s',
    lifetimeRevenue: 150.0,
    campaign: 'M A',
    action: 'Positive Sentiment',
    status: randomStatus(),
  },
  {
    id: '12',
    callerId: '+12165550191',
    lastCall: 'Jul 31, 11:30:00 AM ET',
    duration: '02m 18s',
    lifetimeRevenue: 0,
    campaign: 'P',
    action: 'Negative Sentiment',
    status: randomStatus(),
  },
  {
    id: '13',
    callerId: '+14125550155',
    lastCall: 'Jul 30, 02:45:00 PM ET',
    duration: '05m 45s',
    lifetimeRevenue: 320.75,
    campaign: 'A',
    action: 'Repeat Customer',
    status: randomStatus(),
  },
  {
    id: '14',
    callerId: '+13145550188',
    lastCall: 'Jul 30, 09:15:00 AM ET',
    duration: '03m 52s',
    lifetimeRevenue: 95.5,
    campaign: 'M P',
    action: 'Technical Terms Used',
    status: randomStatus(),
  },
  {
    id: '15',
    callerId: '+16125550133',
    lastCall: 'Jul 29, 04:20:00 PM ET',
    duration: '01m 35s',
    lifetimeRevenue: 0,
    campaign: 'A',
    action: 'No Coverage (ZIP)',
    status: randomStatus(),
  },
]

// Filter options
export const campaignOptions: Array<SelectOption> = [
  { title: 'Medicare Only', value: 'M' },
  { title: 'Appliance Repair Only', value: 'A' },
  { title: 'Pest Control Only', value: 'P' },
]
