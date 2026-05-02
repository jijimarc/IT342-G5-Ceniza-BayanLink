package edu.cit.ceniza.bayanlink.service;

import edu.cit.ceniza.bayanlink.entity.Announcement;
import edu.cit.ceniza.bayanlink.entity.User;
import edu.cit.ceniza.bayanlink.repository.AnnouncementRepository;
import edu.cit.ceniza.bayanlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    public Announcement createAnnouncement(String title, String content, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Announcement announcement = Announcement.builder()
                .title(title)
                .content(content)
                .author(user)
                .build();

        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}