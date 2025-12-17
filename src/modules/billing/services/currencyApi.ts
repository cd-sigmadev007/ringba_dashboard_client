/**
 * Currency API Service
 * Fetches currency information for invoice forms
 */

export interface CurrencyOption {
    code: string
    name: string
    symbol: string
    flagEmoji?: string
    flagCode?: string
}

/**
 * Fetch currencies from REST Countries API
 * This is a free API that provides currency and flag information
 */
export async function fetchCurrencies(): Promise<Array<CurrencyOption>> {
    try {
        const response = await fetch(
            'https://restcountries.com/v3.1/all?fields=name,currencies,cca2,flag'
        )

        if (!response.ok) {
            throw new Error('Failed to fetch currencies from API')
        }

        const countries = await response.json()

        // Extract unique currencies
        const currencyMap = new Map<string, CurrencyOption>()

        for (const country of countries) {
            if (!country.currencies) continue

            const countryCode = country.cca2 || ''
            const flagEmoji = country.flag || ''

            for (const [code, currencyData] of Object.entries(
                country.currencies
            )) {
                if (currencyMap.has(code)) continue

                const currency = currencyData as any
                currencyMap.set(code, {
                    code,
                    name: currency.name || code,
                    symbol: currency.symbol || code,
                    flagEmoji,
                    flagCode: countryCode,
                })
            }
        }

        // Convert to array and sort by code
        return Array.from(currencyMap.values()).sort((a, b) =>
            a.code.localeCompare(b.code)
        )
    } catch (error) {
        console.error('Error fetching currencies:', error)

        // Return common currencies as fallback
        return getDefaultCurrencies()
    }
}

/**
 * Get default/common currencies as fallback
 */
function getDefaultCurrencies(): Array<CurrencyOption> {
    return [
        {
            code: 'USD',
            name: 'United States Dollar',
            symbol: '$',
            flagEmoji: '🇺🇸',
            flagCode: 'US',
        },
        {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
            flagEmoji: '🇪🇺',
            flagCode: 'EU',
        },
        {
            code: 'GBP',
            name: 'British Pound',
            symbol: '£',
            flagEmoji: '🇬🇧',
            flagCode: 'GB',
        },
        {
            code: 'JPY',
            name: 'Japanese Yen',
            symbol: '¥',
            flagEmoji: '🇯🇵',
            flagCode: 'JP',
        },
        {
            code: 'AUD',
            name: 'Australian Dollar',
            symbol: 'A$',
            flagEmoji: '🇦🇺',
            flagCode: 'AU',
        },
        {
            code: 'CAD',
            name: 'Canadian Dollar',
            symbol: 'C$',
            flagEmoji: '🇨🇦',
            flagCode: 'CA',
        },
        {
            code: 'CHF',
            name: 'Swiss Franc',
            symbol: 'CHF',
            flagEmoji: '🇨🇭',
            flagCode: 'CH',
        },
        {
            code: 'CNY',
            name: 'Chinese Yuan',
            symbol: '¥',
            flagEmoji: '🇨🇳',
            flagCode: 'CN',
        },
        {
            code: 'INR',
            name: 'Indian Rupee',
            symbol: '₹',
            flagEmoji: '🇮🇳',
            flagCode: 'IN',
        },
        {
            code: 'SGD',
            name: 'Singapore Dollar',
            symbol: 'S$',
            flagEmoji: '🇸🇬',
            flagCode: 'SG',
        },
    ]
}

/**
 * Get currency by code
 */
export async function getCurrencyByCode(
    code: string
): Promise<CurrencyOption | null> {
    const currencies = await fetchCurrencies()
    return currencies.find((c) => c.code === code) || null
}
