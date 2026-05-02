package edu.cit.ceniza.bayanlink.repository;

import edu.cit.ceniza.bayanlink.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Integer> {
    Optional<Resident> findByUser_UserId(Integer userId);
}