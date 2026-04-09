package edu.cit.ceniza.bayanlink.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointmentId;

    @Column(unique = true, nullable = false)
    private String referenceNumber;

    private String serviceType;

    private LocalDate appointmentDate;

    private LocalTime timeSlot;

    private String status;

    // Foreign Key mapping back to the Resident who booked it
    @ManyToOne
    @JoinColumn(name = "resident_id", referencedColumnName = "residentId")
    private Resident resident;

    // Foreign Key mapping back to the Official who manages it
    @ManyToOne
    @JoinColumn(name = "managed_by_id", referencedColumnName = "officialId")
    private Official managedBy;
}