package edu.cit.ceniza.bayanlink.tests;

import edu.cit.ceniza.bayanlink.document.DocumentRequest;
import edu.cit.ceniza.bayanlink.document.DocumentRequestRepository;
import edu.cit.ceniza.bayanlink.document.DocumentRequestService;
import edu.cit.ceniza.bayanlink.user.resident.ResidentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DocumentRequestServiceTest {

    @Mock
    private DocumentRequestRepository documentRequestRepository;

    @Mock
    private ResidentRepository residentRepository;

    @InjectMocks
    private DocumentRequestService documentRequestService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUpdateDocumentStatus_Success() {
        Integer testRequestId = 1;
        DocumentRequest mockRequest = new DocumentRequest();

        mockRequest.setRequestId(testRequestId.longValue());
        mockRequest.setStatus("PENDING");

        when(documentRequestRepository.findById(testRequestId)).thenReturn(Optional.of(mockRequest));
        when(documentRequestRepository.save(any(DocumentRequest.class))).thenReturn(mockRequest);

        DocumentRequest updatedRequest = documentRequestService.updateDocumentStatus(
                testRequestId,
                101,
                "READY_FOR_PICKUP"
        );

        assertNotNull(updatedRequest);
        assertEquals("READY_FOR_PICKUP", updatedRequest.getStatus());
        verify(documentRequestRepository, times(1)).save(mockRequest);
    }

    @Test
    void testGetResidentRequests_ReturnsList() {
        Integer userId = 5;
        documentRequestService.getResidentRequests(userId);
        verify(documentRequestRepository, times(1)).findByResident_UserId(userId);
    }
}