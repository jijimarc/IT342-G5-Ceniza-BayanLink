package edu.cit.ceniza.bayanlink.repository;

import edu.cit.ceniza.bayanlink.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    // Fetches announcements ordered by the most recent date
    List<Announcement> findAllByOrderByCreatedAtDesc();
}