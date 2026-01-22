import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
    it('should render input with label', () => {
        render(<Input label="Email" id="email-input" />)
        expect(screen.getByText('Email')).toBeInTheDocument()
        // Input doesn't use htmlFor, so we find by id or role
        const input = document.getElementById('email-input') || screen.getByRole('textbox')
        expect(input).toBeInTheDocument()
    })

    it('should handle user input', async () => {
        const user = userEvent.setup()
        render(<Input label="Email" id="email-input" />)

        const input = document.getElementById('email-input') || screen.getByRole('textbox')
        await user.type(input, 'test@example.com')

        expect(input).toHaveValue('test@example.com')
    })

    it('should display error message', () => {
        render(<Input label="Email" error="Invalid email" id="email-input" />)
        expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })
})
