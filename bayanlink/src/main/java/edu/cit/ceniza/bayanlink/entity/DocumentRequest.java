package edu.cit.ceniza.bayanlink.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class DocumentRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestid;

    private Long residentid;
    private String documentType;
    private String requirementURL;
    private LocalDate requestDate;
    private String urgencyLevel;
    private String status;
    private String imagePath;

    @ManyToOne
    @JoinColumn(name = "resident_id")
    private Resident resident; 

    @ManyToOne
    @JoinColumn(name = "processed_by_id", referencedColumnName = "officialId")
    private Official processedBy;
}