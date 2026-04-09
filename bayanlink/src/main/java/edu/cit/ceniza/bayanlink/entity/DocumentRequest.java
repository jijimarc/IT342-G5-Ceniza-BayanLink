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

    private Long residentid; // Foreign Key

    // This attribute dictates WHICH strategy to use at runtime
    private String documentType;

    private String requirementURL;
    private LocalDate requestDate;
    private String urgencyLevel;
    private String status;
    private String processedBy;
}