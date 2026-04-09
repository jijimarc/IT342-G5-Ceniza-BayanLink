package edu.cit.ceniza.bayanlink.service;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import edu.cit.ceniza.bayanlink.strategy.DocumentProcessingStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class DocumentRequestService {

    // Spring Boot automatically injects all beans implementing the interface into this map.
    // The key is the bean name (e.g., "CLEARANCE_STRATEGY").
    private final Map<String, DocumentProcessingStrategy> strategyMap;

    // 4. THE CONTEXT EXECUTION
    public void handleNewRequest(DocumentRequest request) {

        // Dynamically select the correct algorithm based on the documentType attribute
        String strategyKey = request.getDocumentType().toUpperCase() + "_STRATEGY";
        DocumentProcessingStrategy strategy = strategyMap.get(strategyKey);

        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported document type: " + request.getDocumentType());
        }

        // Execute the strategy
        strategy.processRequest(request);
        double fee = strategy.calculateFee(request.getUrgencyLevel());

        System.out.println("Processing " + request.getDocumentType() + " with fee: P" + fee);

        // Save to repository...
    }
}