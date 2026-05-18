package edu.cit.ceniza.bayanlink.document.strategy;

import edu.cit.ceniza.bayanlink.document.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("BARANGAY_CLEARANCE_STRATEGY")
public class ClearanceStrategy implements DocumentProcessingStrategy {
    @Override
    public void processRequest(DocumentRequest request) {
        request.setStatus("PENDING_APPROVAL");
    }
}