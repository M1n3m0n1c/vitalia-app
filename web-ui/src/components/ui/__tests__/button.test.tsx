import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from '../button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles correctly', () => {
    render(<Button variant='destructive'>Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('supports different sizes', () => {
    render(<Button size='lg'>Large Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10')
  })
})
