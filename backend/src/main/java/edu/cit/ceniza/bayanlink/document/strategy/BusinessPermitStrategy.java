package edu.cit.ceniza.bayanlink.document.strategy;

import edu.cit.ceniza.bayanlink.document.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("BUSINESS_PERMIT_STRATEGY")
public class BusinessPermitStrategy implements DocumentProcessingStrategy {

    @Override
    public void processRequest(DocumentRequest request) {
        // Business permits usually require checking if the address is zoned for business
        System.out.println("Processing Barangay Business Permit for User ID: "
                + request.getResident().getUserId());
    }

}