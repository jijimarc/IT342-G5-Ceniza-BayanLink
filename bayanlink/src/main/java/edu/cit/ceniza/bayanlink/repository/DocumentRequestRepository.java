package edu.cit.ceniza.bayanlink.repository;

import edu.cit.ceniza.bayanlink.entity.DocumentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRequestRepository extends JpaRepository<DocumentRequest, Integer> {

    List<DocumentRequest> findByResident_UserId(Integer userId);
    List<DocumentRequest> findByStatus(String status);
}