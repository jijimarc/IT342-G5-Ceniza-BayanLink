package edu.cit.ceniza.bayanlink.strategy;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("BARANGAY_CLEARANCE_STRATEGY")
public class ClearanceStrategy implements DocumentProcessingStrategy {
    @Override
    public void processRequest(DocumentRequest request) {
        request.setStatus("PENDING_APPROVAL");
    }
}