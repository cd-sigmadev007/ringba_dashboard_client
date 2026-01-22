import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OnboardingDots } from '@/modules/onboarding/components/OnboardingDots'

describe('OnboardingDots', () => {
    it('should render correct number of dots', () => {
        render(<OnboardingDots total={3} current={1} />)
        const dots = screen.getAllByRole('tab')
        expect(dots).toHaveLength(3)
    })

    it('should highlight current step', () => {
        render(<OnboardingDots total={3} current={1} />)
        const dots = screen.getAllByRole('tab')
        // Check that current step (index 1, which is current=1) has aria-selected="true"
        // The component uses i === current, so current=1 means index 1 should be selected
        expect(dots[1].getAttribute('aria-selected')).toBe('true')
        // Other dots should have aria-selected="false"
        expect(dots[0].getAttribute('aria-selected')).toBe('false')
        expect(dots[2].getAttribute('aria-selected')).toBe('false')
    })

    it('should handle different step numbers', () => {
        const { rerender } = render(<OnboardingDots total={3} current={1} />)
        expect(screen.getAllByRole('tab')).toHaveLength(3)

        rerender(<OnboardingDots total={5} current={3} />)
        expect(screen.getAllByRole('tab')).toHaveLength(5)
    })
})
