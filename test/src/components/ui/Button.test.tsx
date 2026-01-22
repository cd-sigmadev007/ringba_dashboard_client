import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/ui/Button'

describe('Button', () => {
    it('should render button with text', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('should call onClick when clicked', async () => {
        const handleClick = vi.fn()
        const user = userEvent.setup()

        render(<Button onClick={handleClick}>Click me</Button>)

        await user.click(screen.getByText('Click me'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>)
        expect(screen.getByText('Disabled Button')).toBeDisabled()
    })

    it('should not call onClick when disabled', async () => {
        const handleClick = vi.fn()
        const user = userEvent.setup()

        render(
            <Button onClick={handleClick} disabled>
                Disabled Button
            </Button>
        )

        await user.click(screen.getByText('Disabled Button'))
        expect(handleClick).not.toHaveBeenCalled()
    })

    it('should render different variants', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>)
        expect(screen.getByText('Primary')).toBeInTheDocument()

        rerender(<Button variant="secondary">Secondary</Button>)
        expect(screen.getByText('Secondary')).toBeInTheDocument()
    })
})
