package edu.cit.ceniza.bayanlink.document.strategy;

import edu.cit.ceniza.bayanlink.document.DocumentRequest;

public interface DocumentProcessingStrategy {
    void processRequest(DocumentRequest request);
    String getHtmlTemplate();
}