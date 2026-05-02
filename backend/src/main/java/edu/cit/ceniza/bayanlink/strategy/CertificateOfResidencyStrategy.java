package edu.cit.ceniza.bayanlink.strategy;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("CERTIFICATE_OF_RESIDENCY_STRATEGY")
public class CertificateOfResidencyStrategy implements DocumentProcessingStrategy {

    @Override
    public void processRequest(DocumentRequest request) {
        // Typically involves verifying the resident's length of stay in the database
        System.out.println("Verifying residency records for User ID: "
                + request.getResident().getUserId());
    }

}