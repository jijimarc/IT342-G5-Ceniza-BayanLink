package edu.cit.ceniza.bayanlink.document;

import edu.cit.ceniza.bayanlink.document.strategy.DocumentProcessingStrategy;
import edu.cit.ceniza.bayanlink.config.EmailService;
import edu.cit.ceniza.bayanlink.user.official.Official;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DocumentGenerationService {

    private final DocumentRequestRepository requestRepository;
    private final Map<String, DocumentProcessingStrategy> strategyMap;
    private final EmailService emailService;

    public String processAndGenerateDocument(Long requestId, Official processingOfficial) {

        DocumentRequest request = requestRepository.findById(Math.toIntExact(requestId))
                .orElseThrow(() -> new RuntimeException("Document Request not found"));

        String strategyKey = request.getDocumentType().toUpperCase().replace(" ", "_") + "_STRATEGY";
        DocumentProcessingStrategy strategy = strategyMap.get(strategyKey);

        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported document type for generation.");
        }

        String rawHtmlTemplate = strategy.getHtmlTemplate();

        request.setStatus("READY_FOR_PICKUP");
        request.setProcessedBy(processingOfficial);
        requestRepository.save(request);

        String residentEmail = request.getResidentEmail();
        if (residentEmail != null && !residentEmail.trim().isEmpty() && !residentEmail.equalsIgnoreCase("No Email")) {
            emailService.sendDocumentReadyEmail(
                    residentEmail,
                    request.getResidentName(),
                    request.getDocumentType(),
                    requestId
            );
        }

        String fullName = request.getResidentName();
        String purpose = request.getPurpose() != null ? request.getPurpose() : "General Requirements";
        String address = request.getResident() != null && request.getResident().getAddress() != null
                ? request.getResident().getAddress() : "Address on file";
        String civilStatus = request.getResident() != null && request.getResident().getCivilStatus() != null
                ? request.getResident().getCivilStatus() : "Single";

        return rawHtmlTemplate
                .replace("{{residentName}}", fullName.toUpperCase())
                .replace("{{address}}", address)
                .replace("{{civilStatus}}", civilStatus)
                .replace("{{purpose}}", purpose.toUpperCase())
                .replace("{{currentDate}}", LocalDate.now().toString());
    }
}