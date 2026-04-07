package edu.cit.ceniza.bayanlink.strategy;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("INDIGENCY_STRATEGY")
public class IndigencyStrategy implements DocumentProcessingStrategy {
    @Override
    public void processRequest(DocumentRequest request) {
        request.setStatus("PENDING_SOCIAL_WORKER_REVIEW");
    }

    @Override
    public double calculateFee(String urgencyLevel) {
        return 0.00;
    }
}