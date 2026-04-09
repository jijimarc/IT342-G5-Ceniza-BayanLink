package edu.cit.ceniza.bayanlink.strategy;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;

public interface DocumentProcessingStrategy {
    void processRequest(DocumentRequest request);
    double calculateFee(String urgencyLevel);
}