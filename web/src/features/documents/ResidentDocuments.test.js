import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import DocumentsPage from './ResidentDocuments';

jest.mock('../../shared/components/Sidebar', () => () => <div data-testid="sidebar">Sidebar</div>);
jest.mock('../../shared/context/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 1, fullname: 'Test User' }, token: 'fake-token', logout: jest.fn() })
}));

describe('DocumentsPage Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ([]) // Return empty documents array on mount
    });
  });

  afterEach(() => { jest.clearAllMocks(); });

  const renderComponent = () => render(<BrowserRouter><DocumentsPage /></BrowserRouter>);

  test('renders form and fetches initial documents', async () => {
    renderComponent();
    expect(screen.getByText('Document Requests')).toBeInTheDocument();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1)); // The useEffect fetch
  });

  test('shows error if required fields are missing on submit', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Please fill in all required fields and upload an ID.')).toBeInTheDocument();
  });

  test('clears the form when Remove is clicked', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('State the purpose of your request...'), { target: { value: 'Job Application' } });
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(screen.getByPlaceholderText('State the purpose of your request...').value).toBe('');
  });
});