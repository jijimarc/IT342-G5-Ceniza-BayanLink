package edu.cit.ceniza.bayanlink.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentRequestDTO {
    private Integer residentId;
    private String documentType;
    private String requirementURL;
    private String urgencyLevel;
}