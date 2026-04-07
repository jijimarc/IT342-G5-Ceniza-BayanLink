package edu.cit.ceniza.bayanlink.strategy;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("CLEARANCE_STRATEGY")
public class ClearanceStrategy implements DocumentProcessingStrategy {
    @Override
    public void processRequest(DocumentRequest request) {
        request.setStatus("PENDING_CAPTAIN_APPROVAL");
    }

    @Override
    public double calculateFee(String urgencyLevel) {
        return urgencyLevel.equalsIgnoreCase("RUSH") ? 150.00 : 50.00;
    }
}