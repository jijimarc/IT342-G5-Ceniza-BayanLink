package edu.cit.ceniza.bayanlink.document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.cit.ceniza.bayanlink.user.official.Official;
import edu.cit.ceniza.bayanlink.user.resident.Resident;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class DocumentRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    private Long userId;
    private String documentType;
    private String requirementURL;
    private LocalDate requestDate;
    private String urgencyLevel;
    private String status;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "resident_id")
    private Resident resident;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "processed_by_id")
    private Official processedBy;
}