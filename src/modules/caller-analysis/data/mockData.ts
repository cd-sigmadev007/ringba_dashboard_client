import type { CallData } from '../types';
import type { SelectOption } from '../../../components/ui/FilterSelect';

// Mock data for caller analysis
export const callData: CallData[] = [
  {
    id: '1',
    callerId: '+12025550173',
    lastCall: 'Aug 05, 06:00:00 AM ET',
    duration: '03m 25s',
    lifetimeRevenue: 503.99,
    campaign: 'M A P',
    action: 'Post Control',
    status: 'High Quality Unb...'
  },
  {
    id: '2',
    callerId: '+16175550112',
    lastCall: 'Aug 05, 02:45:00 AM ET',
    duration: '05m 12s',
    lifetimeRevenue: 30.96,
    campaign: 'A',
    action: 'Chargeback Risk (C...',
    status: 'Chargeback Risk (C...'
  },
  {
    id: '3',
    callerId: '+13055550199',
    lastCall: 'Aug 04, 10:20:00 PM ET',
    duration: '02m 45s',
    lifetimeRevenue: 290.45,
    campaign: 'A',
    action: 'Wrong Appliance Ca...',
    status: 'Wrong Appliance Ca...'
  },
  {
    id: '4',
    callerId: '+14155550147',
    lastCall: 'Aug 04, 05:00:00 PM ET',
    duration: '04m 05s',
    lifetimeRevenue: 110.95,
    campaign: 'M P',
    action: 'Wrong Appliance Ca...',
    status: 'Wrong Appliance Ca...'
  },
  {
    id: '5',
    callerId: '+14045550133',
    lastCall: 'Aug 04, 10:30:00 AM ET',
    duration: '06m 13s',
    lifetimeRevenue: 201.00,
    campaign: 'M A P',
    action: 'Wrong Post Control',
    status: 'Wrong Post Control'
  },
  {
    id: '6',
    callerId: '+13125550158',
    lastCall: 'Aug 03, 02:10:00 PM ET',
    duration: '05m 33s',
    lifetimeRevenue: 80.50,
    campaign: 'P',
    action: 'Inquiry / Previous',
    status: 'Caller Hung Up (IV...'
  },
  {
    id: '7',
    callerId: '+12125550184',
    lastCall: 'Aug 03, 09:00:00 AM ET',
    duration: '00m 05s',
    lifetimeRevenue: 0,
    campaign: 'M A P',
    action: 'Caller Hung Up (IV...',
    status: 'Caller Hung Up (IV...'
  },
  {
    id: '8',
    callerId: '+17135550129',
    lastCall: 'Aug 02, 03:20:00 PM ET',
    duration: '01m 09s',
    lifetimeRevenue: 90.50,
    campaign: 'A P',
    action: 'Competitor Mention...',
    status: 'Competitor Mention...'
  },
  {
    id: '9',
    callerId: '+18185550177',
    lastCall: 'Aug 02, 11:00:00 AM ET',
    duration: '03m 30s',
    lifetimeRevenue: 503.99,
    campaign: 'M A',
    action: 'Positive Sentiment',
    status: 'Positive Sentiment'
  },
  {
    id: '10',
    callerId: '+15125550136',
    lastCall: 'Aug 01, 04:00:00 PM ET',
    duration: '01m 02s',
    lifetimeRevenue: 708.20,
    campaign: 'M P',
    action: 'Short Call (105)',
    status: 'Short Call (105)'
  }
];

// Filter options
export const campaignOptions: SelectOption[] = [
  { title: 'Medicare Only', value: 'M' },
  { title: 'Appliance Repair Only', value: 'A' },
  { title: 'Pest Control Only', value: 'P' },
  { title: 'Medicare + Appliance', value: 'M,A' },
  { title: 'Medicare + Pest Control', value: 'M,P' },
  { title: 'Appliance + Pest Control', value: 'A,P' },
  { title: 'All (Medicare + Appliance + Pest)', value: 'M,A,P' },
];

export const statusOptions: SelectOption[] = [
  { title: 'High Quality', value: 'High Quality' },
  { title: 'Chargeback Risk', value: 'Chargeback' },
  { title: 'Wrong Appliance', value: 'Wrong' },
  { title: 'Inquiry/Previous', value: 'Inquiry' },
  { title: 'Caller Hung Up', value: 'Hung Up' },
  { title: 'Competitor Mention', value: 'Competitor' },
  { title: 'Positive Sentiment', value: 'Positive' },
  { title: 'Short Call', value: 'Short Call' },
];
