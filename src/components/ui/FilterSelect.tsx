import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { get, isEqual } from 'lodash';
import { useClickOutside } from '../../lib/hooks/useClickOutside';
import { useThemeStore } from '../../store/themeStore';

export interface SelectOption {
  title: string;
  value: string;
  icon?: string;
  soon?: boolean;
}

interface FilterSelectProps {
  className?: string;
  defaultValue?: SelectOption;
  filterList?: SelectOption[];
  setFilter?: (value: string) => void;
}

/**
 * FilterSelect – dropdown select control adopted from the `frontend` repo.
 * It respects the global theme and semantic Tailwind colour tokens defined in `tailwind.config.ts`.
 */
const FilterSelect: React.FC<FilterSelectProps> = ({
  className,
  defaultValue = { title: '', value: '' },
  filterList = [{ title: '', value: '' }],
  setFilter = () => undefined,
}) => {
  const [openSelect, setOpenSelect] = useState(false);
  const [selected, setSelected] = useState<SelectOption>(defaultValue);
  const theme = useThemeStore((s) => s.theme); // 'dark' | 'light'

  const selectRef = useClickOutside<HTMLDivElement>(() => setOpenSelect(false));

  useEffect(() => {
    setOpenSelect(false);
    setFilter(get(selected, 'value'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  /**
   * Helpers – colour classes based on current theme.
   */
  const isDark = theme === 'dark';
  const bgBase = isDark ? 'bg-primary-600' : 'bg-white';
  const textBase = isDark ? 'text-neutrals-50' : 'text-neutrals-800';
  const borderHover = isDark ? 'hover:border-primary-300' : 'hover:border-primary-500';
  const borderFocus = isDark ? 'focus:border-primary-300' : 'focus:border-primary-500';
  const listBg = isDark ? 'bg-primary-600' : 'bg-white';
  const selectedBg = isDark ? 'bg-primary-300' : 'bg-primary-100';
  const disabledText = isDark ? 'text-neutrals-600' : 'text-neutrals-500';

  return (
    <div
      ref={selectRef}
      className="relative min-w-[160px] lg:min-w-[228px] w-full font-medium"
    >
      {/* Trigger */}
      <div
        className={twMerge(
          clsx(
            'h-11 cursor-pointer w-full flex gap-x-2.5 justify-between items-center py-2.5 text-sm md:text-base px-4 rounded-[7px] border border-transparent transition-all duration-200',
            bgBase,
            textBase,
            borderHover,
            borderFocus,
            openSelect && (isDark ? 'border-primary-300' : 'border-primary-500'),
            className
          )
        )}
        onClick={() => setOpenSelect((prev) => !prev)}
      >
        <span className="flex items-center gap-x-2.5">
          {get(selected, 'icon') && (
            <img
              src={get(selected, 'icon') as string}
              alt={get(selected, 'title')}
              className="w-5 h-5"
            />
          )}
          <span>{get(selected, 'title')}</span>
        </span>
        {/* Chevron */}
        {isDark ? (
          <svg
            className={clsx('transition-transform duration-200', openSelect && 'rotate-180')}
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="14"
            viewBox="0 0 13 14"
            fill="none"
          >
            <path
              d="M2.16602 5.375L6.49935 9.70833L10.8327 5.375"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className={clsx('transition-transform duration-200', openSelect && 'rotate-180')}
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="7"
            viewBox="0 0 11 7"
            fill="none"
          >
            <path
              d="M1.16602 1.375L5.49935 5.70833L9.83268 1.375"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Options list */}
      <div
        className={clsx(
          'w-full absolute mt-2 rounded-[7px] z-40 shadow-lg',
          listBg,
          openSelect ? 'block' : 'hidden'
        )}
      >
        <ul className="flex flex-col gap-y-1 max-h-64 overflow-y-auto custom-scroll p-2.5">
          {filterList.map((item: SelectOption) => (
            <li
              key={item.value}
              className={clsx(
                'flex items-center gap-x-2.5 p-2 rounded-[7px] cursor-pointer transition-colors',
                isEqual(item.value, selected.value) && selectedBg,
                item.soon && disabledText,
                !item.soon && 'hover:bg-primary-300/50'
              )}
              onClick={() => {
                if (!item.soon) setSelected(item);
              }}
            >
              {item.icon && (
                <img src={item.icon} alt={item.title} className="w-5 h-5" />
              )}
              <span>{item.title}</span>
              {item.soon && <span className="labels ml-auto">Soon</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterSelect;