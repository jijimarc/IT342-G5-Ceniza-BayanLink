package edu.cit.ceniza.bayanlink.controller;

import edu.cit.ceniza.bayanlink.entity.Announcement;
import edu.cit.ceniza.bayanlink.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:3000") // Allowing React frontend
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    // 1. Get all announcements (Visible to Residents and Officials)
    @GetMapping
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    // 2. Post an announcement (Official Only)
    @PostMapping
    public ResponseEntity<Announcement> postAnnouncement(@RequestBody Map<String, Object> payload) {
        String title = (String) payload.get("title");
        String content = (String) payload.get("content");
        Integer userId = Integer.valueOf(payload.get("userId").toString());

        return ResponseEntity.ok(announcementService.createAnnouncement(title, content, userId));
    }

    // 3. Delete an announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok().build();
    }
}