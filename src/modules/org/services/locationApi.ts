export interface CountryOption {
    code: string
    name: string
}

export interface PostalLookupResult {
    city?: string
    state?: string
    countryCode?: string
}

export async function fetchCountries(): Promise<Array<CountryOption>> {
    // REST Countries v3.1 — https://restcountries.com/
    // Using minimal fields for performance
    const res = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,cca2'
    )
    if (!res.ok) return []
    const data = await res.json()
    // Map to { code, name } and sort by common name
    const list: Array<CountryOption> = (data as Array<any>).map((c) => ({
        code: c?.cca2,
        name: c?.name?.common ?? c?.name?.official ?? '',
    }))
    return list
        .filter((c) => c.code && c.name)
        .sort((a, b) => a.name.localeCompare(b.name))
}

export async function lookupPostalZippopotam(
    countryCode: string,
    postalCode: string
): Promise<PostalLookupResult | null> {
    // Zippopotam.us — https://api.zippopotam.us/{country}/{postal-code}
    try {
        const res = await fetch(
            `https://api.zippopotam.us/${countryCode}/${postalCode}`
        )
        if (!res.ok) return null
        const data = await res.json()
        const place = data?.places?.[0]
        if (!place) return null
        // API returns both 'state' (full name) and 'state abbreviation' (code like "CA")
        // Prefer state abbreviation if available, fallback to full state name
        const stateValue =
            place?.['state abbreviation'] || place?.['state'] || ''
        return {
            city: place?.['place name'] || '',
            state: stateValue,
            countryCode: data?.['country abbreviation'],
        }
    } catch {
        return null
    }
}
