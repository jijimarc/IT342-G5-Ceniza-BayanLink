package edu.cit.ceniza.bayanlink.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private String status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "hh:mm a")
    private LocalTime timeSlot;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "resident_id")
    private Resident resident;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "managed_by_id")
    private Official managedBy;
}