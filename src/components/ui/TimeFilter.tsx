import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DateRange, SelectRangeEventHandler } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { useClickOutside } from '../../lib/hooks/useClickOutside';
import { useThemeStore } from '../../store/themeStore';
import Button from './Button';
import { cn } from '@/lib';
import { Input } from './Input';
import { ChevronRight, ChevronLeft, Calendar } from '../../assets/svg';

export interface TimeFilterProps {
  /** Callback fired when the range changes */
  onChange?: (range: { from?: Date; to?: Date }) => void;
  className?: string;
}

const presets = [
  { label: 'Today', days: 0 },
  { label: 'Yesterday', days: 1 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 60 days', days: 60 },
  { label: 'Custom', days: 0 },
];

// Custom navigation icons for the calendar
const IconRight = () => <ChevronRight />;
const IconLeft = () => <ChevronLeft />;


const TimeFilter: React.FC<TimeFilterProps> = ({ onChange, className }) => {
  // Re-usable nav button style based on theme
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const triggerRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  // Format the display value based on selected range
  const getDisplayValue = () => {
    if (!range?.from) {
      return ''; // Return empty string to show placeholder
    }
    
    if (range.from && range.to) {
      const fromFormatted = dayjs(range.from).format('MMM DD, YYYY');
      const toFormatted = dayjs(range.to).format('MMM DD, YYYY');
      return `${fromFormatted} - ${toFormatted}`;
    }
    
    if (range.from) {
      return dayjs(range.from).format('MMM DD, YYYY');
    }
    
    return '';
  };

  const applyPreset = (preset: { label: string; days: number }) => {
    const { days, label } = preset;
    const to = dayjs().endOf('day').toDate();
    const from = days === 0 ? dayjs().startOf('day').toDate() : dayjs().subtract(days, 'day').startOf('day').toDate();
    setRange({ from, to });
    setActivePreset(label);
  };

  const handleSelect: SelectRangeEventHandler = (rng) => {
    setRange(rng);
    setActivePreset('Custom');
  };

  return (
    <div ref={triggerRef} className={twMerge('relative', className)}>
      {/* Use your Input component with proper design */}
      <div onClick={() => setOpen(prev => !prev)}>
        <Input
          value={getDisplayValue()}
          placeholder="Aug 01, 2024 - Aug 31, 2024"
          className="cursor-pointer"
          rightIcon={<Calendar />}
          readOnly
        />
      </div>

      {/* Popover */}
      {open && (
        <div
          className={clsx(
            'absolute z-50 rounded-[7px] p-[20px] w-max border flex flex-col gap-[15px] backdrop-blur-[25px] shadow-[0_10px_35px_rgba(0,0,0,0.30)] mt-2',
            isDark
              ? 'border-[#002B57] bg-[#071B2FE6] text-neutrals-50'
              : 'border-gray-200 bg-white text-neutrals-800'
          )}
        >
          <div className="flex flex-col md:flex-row gap-[15px] text-body-xs">
            {/* Preset list */}
            <ul className="flex flex-col gap-[5px] basis-[150px] flex-[2_0_0]">
              {presets.map((p) => (
                <li>
                  <Button
                    variant={'ghost'}
                    onClick={() => applyPreset(p)}
                    className={cn(
                      '!py-[7px] !px-[10px] border-none w-full text-start hover:bg-[#132F4C]',
                      activePreset === p.label ? 'bg-[#132F4C]' : ''
                    )}
                  >
                    {p.label}
                  </Button>
                </li>
              ))}
            </ul>

            {/* Calendar */}
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleSelect}
              className="rdp no-focus"
              components={{
                Chevron: ({ orientation }) => {
                  if (orientation === 'left') {
                    return <IconLeft />;
                  }
                  return <IconRight />;
                }
              }}
              captionLayout="dropdown-years"
              startMonth={dayjs().subtract(25, 'year').toDate()}
              endMonth={dayjs().toDate()}
            />
          </div>
          <div className="horizontal-line" />
          <div className="flex justify-between gap-2">
            <Button variant="ghost" onClick={() => {
              setRange(undefined);
              setActivePreset(null);
              onChange?.({ from: undefined, to: undefined });
              setOpen(false);
            }}>
              Clear
            </Button>
            <Button variant="primary" onClick={() => {
              if (range?.from && range.to) {
                onChange?.({ from: range.from, to: range.to });
              }
              setOpen(false);
            }}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeFilter;