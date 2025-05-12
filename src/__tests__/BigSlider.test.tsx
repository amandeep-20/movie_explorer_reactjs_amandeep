import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BigSlider from '../components/moviesLayout/BigSlider';
import { Episode } from '../../config/MoviesData';

// Mock dependencies
jest.mock('../components/moviesLayout/SliderItem', () => ({ episode, isActive, index }: any) => (
  <div data-testid={`slider-item-${index}`} style={{ display: isActive ? 'block' : 'none' }}>
    {episode.title}
  </div>
));
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: ({ children, sx, ...props }: any) => <div style={sx} data-testid="box" {...props}>{children}</div>,
  IconButton: ({ children, sx, onClick, ...props }: any) => (
    <button style={sx} data-testid="icon-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));
jest.mock('@mui/icons-material', () => ({
  ArrowBackIosNewIcon: () => <span data-testid="arrow-back-icon" />,
  ArrowForwardIosIcon: () => <span data-testid="arrow-forward-icon" />,
}));

describe('BigSlider', () => {
  const mockEpisodes: Episode[] = [
    { id: 1, title: 'Episode 1', image: 'http://example.com/image1.jpg', image2: 'http://example.com/image1b.jpg', desc: 'Desc 1', starRating: 8.0, year: 2020, duration: '1h 30m', date: '2020-01-01', director: 'Director 1', main_lead: 'Lead 1', streaming_platform: 'Platform 1', premium: false },
    { id: 2, title: 'Episode 2', image: 'http://example.com/image2.jpg', image2: 'http://example.com/image2b.jpg', desc: 'Desc 2', starRating: 7.5, year: 2021, duration: '2h 0m', date: '2021-01-01', director: 'Director 2', main_lead: 'Lead 2', streaming_platform: 'Platform 2', premium: true },
    { id: 3, title: 'Episode 3', image: 'http://example.com/image3.jpg', image2: 'http://example.com/image3b.jpg', desc: 'Desc 3', starRating: 8.5, year: 2022, duration: '1h 45m', date: '2022-01-01', director: 'Director 3', main_lead: 'Lead 3', streaming_platform: 'Platform 3', premium: false },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders slider with initial active item', () => {
    render(<BigSlider items={mockEpisodes} />);
    expect(screen.getByTestId('slider-item-0')).toHaveStyle({ display: 'block' });
    expect(screen.getByTestId('slider-item-0')).toHaveTextContent('Episode 1');
    expect(screen.getByTestId('slider-item-1')).toHaveStyle({ display: 'none' });
    expect(screen.getByTestId('slider-item-2')).toHaveStyle({ display: 'none' });
  });

  it('navigates to next slide on next button click', () => {
    render(<BigSlider items={mockEpisodes} />);
    const nextButton = screen.getAllByTestId('icon-button')[1]; // Second button is next
    fireEvent.click(nextButton);
    expect(screen.getByTestId('slider-item-1')).toHaveStyle({ display: 'block' });
    expect(screen.getByTestId('slider-item-1')).toHaveTextContent('Episode 2');
    expect(screen.getByTestId('slider-item-0')).toHaveStyle({ display: 'none' });
    expect(screen.getByTestId('slider-item-2')).toHaveStyle({ display: 'none' });
  });

  it('navigates to previous slide on previous button click', () => {
    render(<BigSlider items={mockEpisodes} />);
    const prevButton = screen.getAllByTestId('icon-button')[0]; // First button is previous
    fireEvent.click(prevButton);
    expect(screen.getByTestId('slider-item-2')).toHaveStyle({ display: 'block' });
    expect(screen.getByTestId('slider-item-2')).toHaveTextContent('Episode 3');
    expect(screen.getByTestId('slider-item-0')).toHaveStyle({ display: 'none' });
    expect(screen.getByTestId('slider-item-1')).toHaveStyle({ display: 'none' });
  });

  it('automatically transitions to next slide after 5 seconds', async () => {
    render(<BigSlider items={mockEpisodes} />);
    expect(screen.getByTestId('slider-item-0')).toHaveStyle({ display: 'block' });
    jest.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(screen.getByTestId('slider-item-1')).toHaveStyle({ display: 'block' });
      expect(screen.getByTestId('slider-item-1')).toHaveTextContent('Episode 2');
      expect(screen.getByTestId('slider-item-0')).toHaveStyle({ display: 'none' });
    });
  });

  it('clears interval on component unmount', () => {
    const { unmount } = render(<BigSlider items={mockEpisodes} />);
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('renders navigation buttons with correct aria-labels', () => {
    render(<BigSlider items={mockEpisodes} />);
    const buttons = screen.getAllByTestId('icon-button');
    expect(buttons[0]).toHaveAttribute('aria-label', 'Previous slide');
    expect(buttons[1]).toHaveAttribute('aria-label', 'Next slide');
    expect(screen.getByTestId('arrow-back-icon')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-forward-icon')).toBeInTheDocument();
  });

  it('handles empty items array gracefully', () => {
    render(<BigSlider items={[]} />);
    expect(screen.queryByTestId('slider-item-0')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('icon-button')).toHaveLength(2); // Buttons still render
  });
});