package edu.cit.ceniza.bayanlink.clinic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClinicServiceRepository extends JpaRepository<ClinicService, Integer> {
    boolean existsByServiceName(String serviceName);
}