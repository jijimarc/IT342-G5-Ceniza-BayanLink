package edu.cit.ceniza.bayanlink.strategy;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("HEALTH_CERTIFICATE_STRATEGY")
public class HealthCertificateStrategy implements DocumentProcessingStrategy {

    @Override
    public void processRequest(DocumentRequest request) {
        // Here you could eventually add logic to check if the resident
        // has a recent health center appointment before approving!
        System.out.println("Validating Health Certificate requirements for User ID: "
                + request.getResident().getUserId());
    }

}