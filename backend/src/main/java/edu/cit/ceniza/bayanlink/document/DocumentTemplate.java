package edu.cit.ceniza.bayanlink.document;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "document_templates")
public class DocumentTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long templateId;

    @Column(unique = true, nullable = false)
    private String documentType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String htmlContent;
}