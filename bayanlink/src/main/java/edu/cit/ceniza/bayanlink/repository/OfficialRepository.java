package edu.cit.ceniza.bayanlink.repository;

import edu.cit.ceniza.bayanlink.entity.Official;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfficialRepository extends JpaRepository<Official, Integer> {
    Optional<Official> findByUser_UserId(Integer userId);
    
}