package edu.cit.ceniza.bayanlink.document;

import edu.cit.ceniza.bayanlink.config.EmailService;
import edu.cit.ceniza.bayanlink.user.resident.Resident;
import edu.cit.ceniza.bayanlink.user.resident.ResidentRepository;
import edu.cit.ceniza.bayanlink.document.strategy.DocumentProcessingStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DocumentRequestService {

    private final Map<String, DocumentProcessingStrategy> strategyMap;
    private final DocumentRequestRepository documentRequestRepository;
    private final ResidentRepository residentRepository;
    private final SupabaseStorageService supabaseStorageService;
    private final EmailService emailService;

    public DocumentRequest handleNewRequest(Integer userId, String fullName, String documentType,
                                            String validId, String purpose, String urgencyLevel, MultipartFile idImage) throws Exception {

        Resident resident = residentRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Resident profile not found for User ID: " + userId));

        String requirementUrl = supabaseStorageService.uploadFile(idImage);

        DocumentRequest request = new DocumentRequest();
        request.setResident(resident);
        request.setDocumentType(documentType);
        request.setRequirementURL(requirementUrl);
        request.setRequestDate(LocalDate.now());
        request.setUrgencyLevel(urgencyLevel);
        request.setStatus("PENDING");
        request.setPurpose(purpose);
        request.setValidIdType(validId);

        String strategyKey = request.getDocumentType().toUpperCase().replace(" ", "_") + "_STRATEGY";
        DocumentProcessingStrategy strategy = strategyMap.get(strategyKey);

        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported document type: " + request.getDocumentType());
        }

        strategy.processRequest(request);
        return documentRequestRepository.save(request);
    }

    public List<DocumentRequest> getResidentRequests(Integer userId) {
        return documentRequestRepository.findByResident_UserId(userId);
    }

    public List<DocumentRequest> getPendingRequests() {
        return documentRequestRepository.findByStatus("PENDING");
    }

    public DocumentRequest updateDocumentStatus(Integer requestId, Integer officialId, String status) {
        DocumentRequest request = documentRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Document request not found with ID: " + requestId));

        request.setStatus(status);
        DocumentRequest savedRequest = documentRequestRepository.save(request);

        if ("REJECTED".equalsIgnoreCase(status)) {
            String residentEmail = savedRequest.getResidentEmail();
            if (residentEmail != null && !residentEmail.trim().isEmpty() && !residentEmail.equalsIgnoreCase("No Email")) {
                emailService.sendDocumentRejectEmail(
                        residentEmail,
                        savedRequest.getResidentName(),
                        savedRequest.getDocumentType(),
                        savedRequest.getRequestId()
                );
            }
        }
        return savedRequest;
    }

    public List<DocumentRequest> getAllRequests() {
        return documentRequestRepository.findAll();
    }
}