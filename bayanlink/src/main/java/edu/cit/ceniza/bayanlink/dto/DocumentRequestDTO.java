package edu.cit.ceniza.bayanlink.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentRequestDTO {
    // The ID of the resident making the request
    private Integer residentId;

    // e.g., "Barangay Clearance", "Certificate of Indigency"
    private String documentType;

    // The link to the file they uploaded for identification requirements
    private String requirementURL;

    // e.g., "Standard", "Urgent" - helps staff sort incoming requests
    private String urgencyLevel;
}