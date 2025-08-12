/**
 * Search component with dropdown suggestions and modern TypeScript patterns
 */

import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '../ui/Input';
import { useThemeStore } from '../../store/themeStore';
import { useDebounceSearch, useClickOutside } from '../../lib/hooks';
import { cn } from '../../lib/utils';
import type { SearchItem, SearchSuggestions } from '../../lib/types';

interface SearchProps {
  /**
   * Whether to use white background (for mobile overlay)
   */
  isWhite?: boolean;
  /**
   * Custom className for the search container
   */
  className?: string;
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  /**
   * Callback when search is performed
   */
  onSearch?: (query: string) => void;
  /**
   * Disable the dropdown suggestions
   */
  disableDropdown?: boolean;
}

/**
 * Search component with real-time suggestions
 * 
 * @example
 * ```tsx
 * <Search placeholder="Search addresses, protocols..." />
 * <Search isWhite className="mobile-search" />
 * ```
 */
export const Search: React.FC<SearchProps> = ({
  isWhite = false,
  className,
  placeholder = 'Search any Address, dApps, NFT Collection',
  onSearch,
  disableDropdown = false,
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({
    wallets: [],
    protocols: [],
    nfts: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { debouncedSearchTerm, isSearching } = useDebounceSearch(searchQuery, 300);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setShowSuggestions(false));

  // Handle search query changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    
    // Call onSearch callback immediately for real-time filtering
    onSearch?.(value);
    
    if (disableDropdown) {
      setShowSuggestions(false);
      return;
    }
    
    if (value.trim() === '') {
      setShowSuggestions(false);
      setSuggestions({ wallets: [], protocols: [], nfts: [] });
    } else {
      setShowSuggestions(true);
    }
  };

  // Handle focus event
  const handleInputFocus = () => {
    if (disableDropdown) return;
    
    if (searchQuery.trim() !== '') {
      setShowSuggestions(true);
    }
  };

  // Perform search when debounced term changes
  React.useEffect(() => {
    if (disableDropdown) return;
    
    if (debouncedSearchTerm.trim() !== '') {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, disableDropdown]);

  // Mock search function - replace with actual API call
  const performSearch = async (query: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock search results - replace with actual API integration
      const mockSuggestions: SearchSuggestions = {
        wallets: query.length > 2 ? [
          {
            type: 'wallet',
            id: '1',
            address: '0x742d35Cc6634C0532925a3b8D9C77a4b3D4c71e9',
            name: 'Wallet 1',
          },
          {
            type: 'wallet',
            id: '2',
            address: '0x8ba1f109551bD432803012645Hac136c22C57b2a',
            name: 'Wallet 2',
          },
        ] : [],
        protocols: query.length > 2 ? [
          {
            type: 'protocol',
            id: 'uniswap',
            name: 'Uniswap',
            logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
            description: 'Decentralized trading protocol',
          },
          {
            type: 'protocol',
            id: 'aave',
            name: 'Aave',
            logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
            description: 'Liquidity protocol',
          },
        ] : [],
        nfts: query.length > 2 ? [
          {
            type: 'nft',
            id: 'bayc',
            address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
            name: 'Bored Ape Yacht Club',
            logo: 'https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s130',
          },
        ] : [],
      };
      
      setSuggestions(mockSuggestions);
      onSearch?.(query);
      
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle navigation to search results
  const handleNavigation = (item: SearchItem) => {
    setShowSuggestions(false);
    setSearchQuery('');
    
    switch (item.type) {
      case 'wallet':
        navigate({ to: `/portfolio/${item.address}` });
        break;
      case 'protocol':
        navigate({ to: `/dapp-analysis/${item.id}` });
        break;
      case 'nft':
        navigate({ to: `/nft-analysis/${item.address}` });
        break;
    }
  };

  // Render search suggestion items
  const renderSuggestionItems = (items: SearchItem[]) => {
    return items.map((item) => {
      const displayText = item.name || (item.address && `${item.address.slice(0, 6)}...${item.address.slice(-4)}`) || item.id;
      
      return (
        <div
          key={item.id}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
            'hover:bg-accent hover:text-accent-foreground'
          )}
          onClick={() => handleNavigation(item)}
        >
          {item.logo ? (
            <img
              src={item.logo}
              alt={item.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
              {displayText.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayText}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground truncate">{item.description}</p>
            )}
          </div>
        </div>
      );
    });
  };

  const hasResults = suggestions.wallets.length > 0 || suggestions.protocols.length > 0 || suggestions.nfts.length > 0;

  return (
    <div className={cn('relative w-full max-w-[490px]', className)}>
      <Input
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        leftIcon={
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        className={cn(
          'pr-12',
          isWhite && !isDark && 'bg-white'
        )}
        shadow={false}
      />

      {/* Search suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-lg',
            'max-h-[400px] overflow-y-auto'
          )}
        >
          {isSearching ? (
            <div className="p-4">
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-muted rounded-full" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : hasResults ? (
            <div className="p-2">
              {suggestions.wallets.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground px-3 py-2">
                    Wallets
                  </h3>
                  {renderSuggestionItems(suggestions.wallets)}
                </div>
              )}
              
              {suggestions.protocols.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground px-3 py-2">
                    Protocols
                  </h3>
                  {renderSuggestionItems(suggestions.protocols)}
                </div>
              )}
              
              {suggestions.nfts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground px-3 py-2">
                    NFT Collections
                  </h3>
                  {renderSuggestionItems(suggestions.nfts)}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
