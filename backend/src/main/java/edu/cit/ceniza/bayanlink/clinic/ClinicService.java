package edu.cit.ceniza.bayanlink.clinic;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clinic_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClinicService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String serviceName;

    @Column(name = "is_available", columnDefinition = "boolean default true")
    private boolean isAvailable = true;
}