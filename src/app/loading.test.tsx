import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loading from './loading';

describe('Loading', () => {
  it('renders a loading indicator', () => {
    const { container } = render(<Loading />);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
