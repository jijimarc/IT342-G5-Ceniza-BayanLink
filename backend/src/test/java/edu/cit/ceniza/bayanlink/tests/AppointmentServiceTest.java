package edu.cit.ceniza.bayanlink.tests;

import edu.cit.ceniza.bayanlink.appointment.Appointment;
import edu.cit.ceniza.bayanlink.appointment.AppointmentRepository;
import edu.cit.ceniza.bayanlink.appointment.AppointmentService;
import edu.cit.ceniza.bayanlink.config.EmailService;
import edu.cit.ceniza.bayanlink.user.User;
import edu.cit.ceniza.bayanlink.user.official.Official;
import edu.cit.ceniza.bayanlink.user.official.OfficialRepository;
import edu.cit.ceniza.bayanlink.user.resident.Resident;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentServiceTest {

    @Mock
    private OfficialRepository officialRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AppointmentService appointmentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testApproveAppointment_UpdatesStatus() {
        User mockUser = new User();
        mockUser.setUserEmail("resident@gmail.com");
        Resident mockResident = new Resident();
        mockResident.setUser(mockUser);
        Official mockOfficial = new Official();
        mockOfficial.setUserId(101);
        when(officialRepository.findById(101)).thenReturn(Optional.of(mockOfficial));
        Integer appointmentId = 1;
        Appointment mockAppointment = new Appointment();
        mockAppointment.setAppointmentId(appointmentId);
        mockAppointment.setStatus("PENDING");
        mockAppointment.setResident(mockResident);

        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(mockAppointment));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(mockAppointment);

        Appointment approvedAppointment = appointmentService.updateAppointmentStatus(appointmentId, 101, "APPROVED");

        assertNotNull(approvedAppointment);
        assertEquals("APPROVED", approvedAppointment.getStatus());
        verify(appointmentRepository, times(1)).save(mockAppointment);
    }

    @Test
    void testGetDailySchedule_ReturnsAppointmentsForDate() {
        LocalDate today = LocalDate.now();
        Appointment appt1 = new Appointment();
        appt1.setAppointmentDate(today);
        appt1.setStatus("APPROVED");

        when(appointmentRepository.findByAppointmentDate(today))
                .thenReturn(Arrays.asList(appt1));

        List<Appointment> dailySchedule = appointmentService.getDailySchedule(today);

        assertNotNull(dailySchedule);
        assertEquals(1, dailySchedule.size());
        verify(appointmentRepository, times(1)).findByAppointmentDate(today);
    }

    @Test
    void testUpdateAppointment_NotFound_ThrowsException() {
        when(appointmentRepository.findById(99)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            appointmentService.updateAppointmentStatus(99, 101, "APPROVED");
        });

        assertTrue(exception.getMessage().contains("not found") || exception.getMessage().contains("Appointment"));
    }
}