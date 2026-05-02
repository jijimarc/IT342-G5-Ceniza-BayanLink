package edu.cit.ceniza.bayanlink.controller;

import edu.cit.ceniza.bayanlink.dto.AppointmentDTO;
import edu.cit.ceniza.bayanlink.entity.Appointment;
import edu.cit.ceniza.bayanlink.service.AppointmentService;
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
        return ResponseEntity.ok(updated);
    }
}