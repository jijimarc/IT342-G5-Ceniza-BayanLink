package edu.cit.ceniza.bayanlink.document;

import edu.cit.ceniza.bayanlink.user.official.Official;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class DocumentGenerationService {

    @Autowired
    private DocumentRequestRepository requestRepository;

    @Autowired
    private DocumentTemplateRepository templateRepository;

    public String processAndGenerateDocument(Long requestId, Official processingOfficial) {

        DocumentRequest request = requestRepository.findById(Math.toIntExact(requestId))
                .orElseThrow(() -> new RuntimeException("Document Request not found"));

        DocumentTemplate template = templateRepository.findByDocumentType(request.getDocumentType())
                .orElseThrow(() -> new RuntimeException("Template missing for: " + request.getDocumentType()));

        request.setStatus("READY_FOR_PICKUP");
        request.setProcessedBy(processingOfficial);
        requestRepository.save(request);

        String fullName = request.getResidentName();
        String purpose = request.getPurpose() != null ? request.getPurpose() : "General Requirements";

        String address = request.getResident() != null ? request.getResident().getAddress() : "Address on file";
        String civilStatus = request.getResident() != null ? request.getResident().getCivilStatus() : "Single";

        String readyToPrintHtml = template.getHtmlContent()
                .replace("{{residentName}}", fullName.toUpperCase())
                .replace("{{address}}", address)
                .replace("{{civilStatus}}", civilStatus)
                .replace("{{purpose}}", purpose.toUpperCase())
                .replace("{{currentDate}}", LocalDate.now().toString());

        return readyToPrintHtml;
    }
}