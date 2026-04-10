package edu.cit.ceniza.bayanlink.controller;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import edu.cit.ceniza.bayanlink.service.DocumentRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class DocumentRequestController {

    private final DocumentRequestService documentRequestService;

    @PostMapping("/request")
    public ResponseEntity<?> submitDocumentRequest(
            @RequestParam("userId") Integer userId,
            @RequestParam("fullName") String fullName,
            @RequestParam("documentType") String documentType,
            @RequestParam("validId") String validId,
            @RequestParam("purpose") String purpose,
            @RequestParam("idImage") MultipartFile idImage) {
        
        try {
            DocumentRequest newDoc = documentRequestService.handleNewRequest(
                userId, fullName, documentType, validId, purpose, idImage
            );
            System.out.println("Received userId: " + userId);
        System.out.println("Received fullName: " + fullName);
        System.out.println("Received documentType: " + documentType);
        System.out.println("Received file: " + (idImage != null ? idImage.getOriginalFilename() : "NULL"));
            return ResponseEntity.ok(newDoc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process request: " + e.getMessage());
        }

        
    }

    @GetMapping("/resident/{residentId}")
    public ResponseEntity<List<DocumentRequest>> getResidentRequests(@PathVariable Integer residentId)
    {
        List<DocumentRequest> history = documentRequestService.getResidentRequests(residentId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<DocumentRequest>> getPendingRequests() {
         List<DocumentRequest> pending = documentRequestService.getPendingRequests();
         return ResponseEntity.ok(pending);
    }
}