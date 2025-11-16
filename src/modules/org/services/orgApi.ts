export async function getOrg() {
    const res = await fetch('/api/org')
    if (!res.ok) throw new Error('Failed to fetch organization')
    return res.json()
}

export async function patchOrg(payload: any) {
    const res = await fetch('/api/org', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to update organization')
    return res.json()
}

export async function rotateApiKey() {
    const res = await fetch('/api/org/rotate-api-key', { method: 'POST' })
    if (!res.ok) throw new Error('Failed to rotate API key')
    return res.json()
}
