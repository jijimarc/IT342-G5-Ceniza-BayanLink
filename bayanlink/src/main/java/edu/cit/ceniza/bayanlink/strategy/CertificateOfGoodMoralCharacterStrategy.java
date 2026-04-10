package edu.cit.ceniza.bayanlink.strategy;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("CERTIFICATE_OF_GOOD_MORAL_CHARACTER_STRATEGY")
public class CertificateOfGoodMoralCharacterStrategy implements DocumentProcessingStrategy {

    @Override
    public void processRequest(DocumentRequest request) {
        // In a real-world scenario, this might query a 'Barangay Blotter' or 'Lupon' table
        // to ensure no pending cases exist against the resident.
        System.out.println("Checking Lupon/Blotter records for User ID: "
                + request.getResident().getUserId());
    }
}