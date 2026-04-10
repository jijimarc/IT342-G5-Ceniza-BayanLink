package edu.cit.ceniza.bayanlink.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    private Integer residentId;
    private String serviceType;
    private LocalDate appointmentDate;
    private LocalTime timeSlot;
}