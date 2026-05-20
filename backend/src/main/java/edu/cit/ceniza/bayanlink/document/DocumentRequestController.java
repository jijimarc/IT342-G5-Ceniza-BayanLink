package edu.cit.ceniza.bayanlink.document;

import edu.cit.ceniza.bayanlink.user.official.Official;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class DocumentRequestController {

    private final DocumentRequestService documentRequestService;
    private final DocumentGenerationService documentGenerateService;

    @PostMapping("/request")
    public ResponseEntity<?> submitDocumentRequest(
            @RequestParam("userId") Integer userId,
            @RequestParam("fullName") String fullName,
            @RequestParam("documentType") String documentType,
            @RequestParam("validId") String validId,
            @RequestParam("purpose") String purpose,
            @RequestParam("urgencyLevel") String urgencyLevel,
            @RequestParam("idImage") MultipartFile idImage) {
        
        try {
            DocumentRequest newDoc = documentRequestService.handleNewRequest(
                userId, fullName, documentType, validId, purpose, urgencyLevel, idImage
            );
            System.out.println("Received userId: " + userId);
            System.out.println("Received fullName: " + fullName);
            System.out.println("Received documentType: " + documentType);
            System.out.println("Received file: " + idImage.getOriginalFilename());
            return ResponseEntity.ok(newDoc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process request: " + e.getMessage());
        }

        
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DocumentRequest>> getResidentRequests(@PathVariable("userId") Integer userId)
    {
        List<DocumentRequest> history = documentRequestService.getResidentRequests(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<DocumentRequest>> getPendingRequests() {
         List<DocumentRequest> pending = documentRequestService.getPendingRequests();
         return ResponseEntity.ok(pending);
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<DocumentRequest> updateStatus(
            @PathVariable Integer requestId,
            @RequestParam Integer officialId,
            @RequestParam String status) {

        DocumentRequest updated = documentRequestService.updateDocumentStatus(requestId, officialId, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DocumentRequest>> getAllRequests() {
        List<DocumentRequest> allDocs = documentRequestService.getAllRequests();
        return ResponseEntity.ok(allDocs);
    }

    @PostMapping("/{requestId}/process")
    public ResponseEntity<String> processDocument(
            @PathVariable Long requestId,
            @AuthenticationPrincipal Official processingOfficial) {

        try {
            String readyToPrintHtml = documentGenerateService.processAndGenerateDocument(requestId, processingOfficial);

            return ResponseEntity.ok(readyToPrintHtml);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing document: " + e.getMessage());
        }
    }
}