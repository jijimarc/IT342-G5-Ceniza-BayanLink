package edu.cit.ceniza.bayanlink.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentRequestDTO {
    private Integer userId;
    private String documentType;
    private String requirementURL;
    private String urgencyLevel;
}