import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Register Component', () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.clearAllMocks(); });

  const renderComponent = () => render(<BrowserRouter><Register /></BrowserRouter>);

  test('shows error on weak password', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Juan'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getAllByPlaceholderText('*********')[0], { target: { value: 'weakpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(screen.getByText('Password needs at least 1 number and 1 special character.')).toBeInTheDocument();
  });

  test('shows error when passwords do not match', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'test@gmail.com' } });
    const passwordInputs = screen.getAllByPlaceholderText('*********');
    fireEvent.change(passwordInputs[0], { target: { value: 'StrongPass1!' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'StrongPass2@' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  test('submits successfully when form is valid', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'test@gmail.com' } });
    const passwordInputs = screen.getAllByPlaceholderText('*********');
    fireEvent.change(passwordInputs[0], { target: { value: 'StrongPass1!' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'StrongPass1!' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    
    // FIX: Wait for the success Toast to appear!
    expect(await screen.findByText('User registered successfully!')).toBeInTheDocument();
    
    // FIX: Wait for the 1000ms setTimeout to finish and navigate
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 1500 });
  });
});