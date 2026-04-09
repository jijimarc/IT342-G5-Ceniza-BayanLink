package edu.cit.ceniza.bayanlink.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    // The ID of the resident booking the appointment
    private Integer residentId;

    // e.g., "Medical Consultation", "Captain's Counseling"
    private String serviceType;

    // The specific calendar day selected
    private LocalDate appointmentDate;

    // The specific time block selected
    private LocalTime timeSlot;
}