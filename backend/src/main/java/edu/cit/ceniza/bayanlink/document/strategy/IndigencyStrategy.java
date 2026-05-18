package edu.cit.ceniza.bayanlink.document.strategy;

import edu.cit.ceniza.bayanlink.document.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("CERTIFICATE_OF_INDIGENCY_STRATEGY")
public class IndigencyStrategy implements DocumentProcessingStrategy {
    @Override
    public void processRequest(DocumentRequest request) {
        request.setStatus("PENDING_APPROVAL");
    }

}