package edu.cit.ceniza.bayanlink.service;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import edu.cit.ceniza.bayanlink.entity.Resident;
import edu.cit.ceniza.bayanlink.repository.DocumentRequestRepository;
import edu.cit.ceniza.bayanlink.repository.ResidentRepository;
import edu.cit.ceniza.bayanlink.strategy.DocumentProcessingStrategy;
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

    public DocumentRequest handleNewRequest(Integer userId, String fullName, String documentType, 
                                            String validId, String purpose, String urgencyLevel, MultipartFile idImage) throws Exception {

        Resident resident = residentRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Resident profile not found for User ID: " + userId));

        String requirementUrl = "https://supabase-bucket-url.com/uploads/" + idImage.getOriginalFilename();

        DocumentRequest request = new DocumentRequest();
        request.setResident(resident);
        request.setDocumentType(documentType);
        request.setRequirementURL(requirementUrl);
        request.setRequestDate(LocalDate.now());
        request.setUrgencyLevel(urgencyLevel);
        request.setStatus("Pending");

        String strategyKey = request.getDocumentType().toUpperCase().replace(" ", "_") + "_STRATEGY";
        DocumentProcessingStrategy strategy = strategyMap.get(strategyKey);

        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported document type: " + request.getDocumentType());
        }

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
        return documentRequestRepository.findByStatus("Pending");
    }
}