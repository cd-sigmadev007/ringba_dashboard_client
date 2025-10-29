/**
 * Add Allowed Email Modal
 * Modal form to add email to the allowlist
 */

import { useState } from 'react'
import { useAddAllowedEmail } from '../hooks/useAllowedEmails'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface AddAllowedEmailModalProps {
  open: boolean
  onClose: () => void
}

export default function AddAllowedEmailModal({
  open,
  onClose,
}: AddAllowedEmailModalProps) {
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const addEmailMutation = useAddAllowedEmail()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address')
      return
    }

    try {
      await addEmailMutation.mutateAsync({
        email: email.trim(),
        notes: notes.trim() || undefined,
      })
      // Reset form and close modal
      setEmail('')
      setNotes('')
      setError(null)
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to add email. Please try again.'
      )
    }
  }

  const handleClose = () => {
    if (!addEmailMutation.isPending) {
      setEmail('')
      setNotes('')
      setError(null)
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Email to Allowlist">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email Address *
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            disabled={addEmailMutation.isPending}
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes about why this email was added"
            rows={3}
            disabled={addEmailMutation.isPending}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            onClick={(e) => {
              e.preventDefault()
              handleClose()
            }}
            variant="ghost"
            disabled={addEmailMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              handleSubmit(e)
            }}
            variant="primary"
            disabled={addEmailMutation.isPending || !email.trim()}
          >
            {addEmailMutation.isPending ? 'Adding...' : 'Add Email'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

