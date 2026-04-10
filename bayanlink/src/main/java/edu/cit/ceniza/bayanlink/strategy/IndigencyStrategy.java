package edu.cit.ceniza.bayanlink.strategy;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("CERTIFICATE_OF_INDIGENCY_STRATEGY")
public class IndigencyStrategy implements DocumentProcessingStrategy {
    @Override
    public void processRequest(DocumentRequest request) {
        request.setStatus("PENDING_APPROVAL");
    }

}