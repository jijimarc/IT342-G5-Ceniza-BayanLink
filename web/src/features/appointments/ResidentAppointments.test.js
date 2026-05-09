import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AppointmentsPage from './ResidentAppointments';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../shared/context/AuthContext', () => ({
  useAuth: () => ({
    user: { userId: 1, fullname: 'Juan Dela Cruz', role: 'Resident', isGuest: false },
    token: 'fake-jwt-token',
    logout: jest.fn()
  })
}));

jest.mock('../../shared/components/Sidebar', () => () => <div data-testid="mock-sidebar">Sidebar</div>);

describe('AppointmentsPage Component', () => {
  
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AppointmentsPage />
      </BrowserRouter>
    );
  };

  test('renders the form and available time slots', () => {
    renderComponent();
    expect(screen.getByText('Community Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument(); 
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '08:00 AM' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '04:00 PM' })).toBeInTheDocument();
  });

  test('updates the summary box dynamically when fields are filled', () => {
    renderComponent();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Clinic Check-up' } });
    const dateInput = document.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: '2026-05-20' } });
    fireEvent.click(screen.getByRole('button', { name: '10:00 AM' }));
    const summaryBox = screen.getByPlaceholderText(/Your scheduling summary will appear here/i);
    expect(summaryBox.value).toContain('Clinic Check-up');
    expect(summaryBox.value).toContain('2026-05-20');
    expect(summaryBox.value).toContain('10:00 AM');
  });

  test('clears the form when the Remove button is clicked', () => {
    renderComponent();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Document Pick-up' } });
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(screen.getByRole('combobox').value).toBe('');
  });

  test('shows an error toast if required fields are missing on submit', async () => {
    renderComponent();
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Please select a service, date, and time slot.')).toBeInTheDocument();
  });

  test('submits successfully and shows success toast', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ referenceNumber: 'REF-999' }),
    });

    renderComponent();
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Counseling' } });
    fireEvent.change(document.querySelector('input[type="date"]'), { target: { value: '2026-06-01' } });
    fireEvent.click(screen.getByRole('button', { name: '02:00 PM' }));
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Appointment booked! Ref: REF-999')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const fetchArgs = global.fetch.mock.calls[0];
    expect(fetchArgs[0]).toBe('http://localhost:8080/api/appointments/book');
    
    const requestBody = JSON.parse(fetchArgs[1].body);
    expect(requestBody.serviceType).toBe('Counseling');
    expect(requestBody.userId).toBe(1); 
  });

});