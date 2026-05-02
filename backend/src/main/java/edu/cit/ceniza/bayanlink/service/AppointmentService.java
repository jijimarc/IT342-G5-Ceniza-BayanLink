package edu.cit.ceniza.bayanlink.service;

import edu.cit.ceniza.bayanlink.dto.AppointmentDTO;
import edu.cit.ceniza.bayanlink.entity.Appointment;
import edu.cit.ceniza.bayanlink.entity.Official;
import edu.cit.ceniza.bayanlink.entity.Resident;
import edu.cit.ceniza.bayanlink.repository.AppointmentRepository;
import edu.cit.ceniza.bayanlink.repository.OfficialRepository;
import edu.cit.ceniza.bayanlink.repository.ResidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ResidentRepository residentRepository;
    private final OfficialRepository officialRepository;

    public Appointment bookAppointment(AppointmentDTO dto) {
        Resident resident = residentRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        Appointment newAppointment = new Appointment();
        newAppointment.setResident(resident);
        newAppointment.setServiceType(dto.getServiceType());
        newAppointment.setAppointmentDate(dto.getAppointmentDate());
        newAppointment.setTimeSlot(dto.getTimeSlot());
        newAppointment.setStatus("Pending");
        newAppointment.setNotes(dto.getNotes());

        String refNumber = "APT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        newAppointment.setReferenceNumber(refNumber);

        return appointmentRepository.save(newAppointment);
    }

    public List<Appointment> getResidentAppointments(Integer userId) {
        return appointmentRepository.findByResident_UserId(userId);
    }

    public List<Appointment> getPendingAppointments() {
        return appointmentRepository.findByStatus("Pending");
    }

    public List<Appointment> getDailySchedule(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    public Appointment updateAppointmentStatus(Integer appointmentId, Integer officialId, String newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
                
        Official official = officialRepository.findById(officialId)
                .orElseThrow(() -> new RuntimeException("Official not found"));

        appointment.setStatus(newStatus);
        appointment.setManagedBy(official); 

        return appointmentRepository.save(appointment);
    }
}