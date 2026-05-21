package edu.cit.ceniza.bayanlink.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRequestRepository extends JpaRepository<DocumentRequest, Integer> {
    List<DocumentRequest> findByRequestId(Long requestId);
    List<DocumentRequest> findByResident_UserId(Integer userId);
    List<DocumentRequest> findByStatus(String status);
}