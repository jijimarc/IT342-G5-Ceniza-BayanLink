package edu.cit.ceniza.bayanlink.strategy;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("COMMUNITY_TAX_CERTIFICATE_STRATEGY")
public class CommunityTaxCertificateStrategy implements DocumentProcessingStrategy {

    @Override
    public void processRequest(DocumentRequest request) {
        // Cedulas require capturing the resident's profession and basic tax info
        System.out.println("Processing Community Tax Certificate (Cedula) for User ID: "
                + request.getResident().getUserId());
    }
}