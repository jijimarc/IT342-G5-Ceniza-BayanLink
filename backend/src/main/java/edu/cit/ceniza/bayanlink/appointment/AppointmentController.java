package edu.cit.ceniza.bayanlink.appointment;

import edu.cit.ceniza.bayanlink.config.EmailService;
import edu.cit.ceniza.bayanlink.user.User;
import edu.cit.ceniza.bayanlink.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody AppointmentDTO request) {
        Appointment savedAppointment = appointmentService.bookAppointment(request);
        return ResponseEntity.ok(savedAppointment);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getResidentAppointments(@PathVariable("userId") Integer userId) {
        List<Appointment> history = appointmentService.getResidentAppointments(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Appointment>> getPendingAppointments() {
        List<Appointment> pending = appointmentService.getPendingAppointments();
        return ResponseEntity.ok(pending);
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<Appointment>> getDailySchedule(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Appointment> schedule = appointmentService.getDailySchedule(date);
        return ResponseEntity.ok(schedule);
    }

    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Integer appointmentId,
            @RequestParam Integer officialId,
            @RequestParam String status) {

        Appointment updated = appointmentService.updateAppointmentStatus(appointmentId, officialId, status);

        if ("APPROVED".equalsIgnoreCase(status)) {
            try {
                User user = updated.getResident().getUser();

                String userEmail = user.getUserEmail();
                String userName = user.getUserFirstname();

                String serviceType = updated.getServiceType();
                String date = updated.getAppointmentDate().toString();
                String time = updated.getTimeSlot().toString();

                emailService.sendAppointmentApprovalEmail(userEmail, userName, serviceType, date, time);

            } catch (Exception e) {
                System.err.println("Status updated to DB, but email failed to send: " + e.getMessage());
            }
        }
        if ("REJECTED".equalsIgnoreCase(status)) {
            try {
                User user = updated.getResident().getUser();

                emailService.sendAppointmentRejectEmail(
                        user.getUserEmail(),
                        user.getUserFirstname(),
                        updated.getServiceType(),
                        updated.getAppointmentDate().toString()
                );
            } catch (Exception e) {
                System.err.println("Failed to send rejection email: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(updated);
    }
}