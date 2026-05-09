import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock Router
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock AuthContext
const mockLogin = jest.fn();
jest.mock('../../shared/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin })
}));

describe('Login Component', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const renderComponent = () => render(<BrowserRouter><Login /></BrowserRouter>);

  test('renders login form correctly', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('*********')).toBeInTheDocument();
  });

  test('shows error if email is not @gmail.com', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'test@yahoo.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Only @gmail.com addresses are allowed.')).toBeInTheDocument();
  });

  test('calls login and navigates on success', async () => {
    mockLogin.mockResolvedValueOnce({ success: true });
    renderComponent();
    
    fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'user@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('*********'), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    // FIX: Wait for the success Toast to appear!
    expect(await screen.findByText('Login success!')).toBeInTheDocument();
    
    // FIX: Wait for the 1000ms setTimeout to finish and navigate to clear act() warnings!
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 1500 });
  });

  test('handles guest login correctly', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: 'Continue as Guest' }));
    
    expect(mockLogin).toHaveBeenCalledWith(null, true);
    
    // FIX: Wait for the guest success Toast!
    expect(await screen.findByText('Guest login success!')).toBeInTheDocument();
    
    // FIX: Wait for the 1000ms setTimeout to finish
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 1500 });
  });
});