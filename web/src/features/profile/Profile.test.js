import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './ProfilePage';

jest.mock('../../shared/components/Sidebar', () => () => <div data-testid="sidebar">Sidebar</div>);

let mockContextValue;
jest.mock('../../shared/context/AuthContext', () => ({
  useAuth: () => mockContextValue
}));

describe('ProfilePage Component', () => {
  beforeEach(() => { 
    global.fetch = jest.fn(); 
    mockContextValue = { 
      user: { userId: 1, fullname: 'John Doe', role: 'Resident', email: 'test@gmail.com' }, 
      token: 'fake-token', 
      updateUser: jest.fn() 
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('loads and displays authenticated user profile', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ userFirstname: 'John', userLastname: 'Doe', occupation: 'Engineer' })
    });
    
    render(<Profile />);
    
    // FIX: Wait for the fetch and the edit button to render
    const editButton = await screen.findByRole('button', { name: 'Edit Profile' });
    fireEvent.click(editButton);
    
    // FIX: Wait for the input to populate with the fetched data
    await waitFor(() => {
      expect(screen.getByDisplayValue('Engineer')).toBeInTheDocument();
    });
  });

  test('restricts editing for Guest users', async () => {
    mockContextValue = { user: { isGuest: true, role: 'Guest' } };
    render(<Profile />);
    // FIX: Wait for the text to render
    expect(await screen.findByText('Guests cannot edit profiles.')).toBeInTheDocument();
  });

  test('calculates age automatically based on birthdate', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true, json: async () => ({})
    });
    render(<Profile />);
    
    // FIX: Wait for the fetch to finish
    const editButton = await screen.findByRole('button', { name: 'Edit Profile' });
    fireEvent.click(editButton);
    
    const year = new Date().getFullYear() - 20;
    const dateInput = document.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: `${year}-01-01` } });
    
    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.some(input => input.value === '20' || input.value === '19')).toBeTruthy();
    });
  });

  test('saves profile and updates context', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ userFirstname: 'John' }) });
    global.fetch.mockResolvedValueOnce({ ok: true });
    
    render(<Profile />);
    
    // FIX: Wait for the fetch to finish
    const editButton = await screen.findByRole('button', { name: 'Edit Profile' });
    fireEvent.click(editButton);
    
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
      expect(mockContextValue.updateUser).toHaveBeenCalled();
    });
  });
});