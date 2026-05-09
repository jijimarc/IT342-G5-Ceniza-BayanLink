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

    private String documentType;
    private String requirementURL;
    private LocalDate requestDate;
    private String urgencyLevel;
    private String status;

    private String purpose;
    private String validIdType;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "resident_id")
    private Resident resident;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "processed_by_id")
    private Official processedBy;

    public String getUrgency() {
        return this.urgencyLevel;
    }

    public String getResidentName() {
        if (this.resident != null && this.resident.getUser() != null) {
            String first = this.resident.getUser().getUserFirstname();
            String last = this.resident.getUser().getUserLastname();
            return (first != null ? first : "") + " " + (last != null ? last : "");
        }
        return "Unknown Resident";
    }

    public String getResidentEmail() {
        if (this.resident != null && this.resident.getUser() != null) {
            return this.resident.getUser().getUserEmail();
        }
        return "No Email";
    }
}