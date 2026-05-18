package edu.cit.ceniza.bayanlink.tests;

import edu.cit.ceniza.bayanlink.announcement.Announcement;
import edu.cit.ceniza.bayanlink.announcement.AnnouncementRepository;
import edu.cit.ceniza.bayanlink.announcement.AnnouncementService;
import edu.cit.ceniza.bayanlink.user.User;
import edu.cit.ceniza.bayanlink.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AnnouncementServiceTest {

    @Mock
    private AnnouncementRepository announcementRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AnnouncementService announcementService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateAnnouncement_Success() {
        User mockUser = new User();
        mockUser.setUserId(1);
        mockUser.setUserFirstname("Admin");

        when(userRepository.findById(1)).thenReturn(Optional.of(mockUser));

        Announcement expectedAnnouncement = Announcement.builder()
                .title("Free Checkups")
                .content("Available tomorrow at the clinic.")
                .author(mockUser)
                .build();

        when(announcementRepository.save(any(Announcement.class))).thenReturn(expectedAnnouncement);

        Announcement savedAnnouncement = announcementService.createAnnouncement(
                "Free Checkups",
                "Available tomorrow at the clinic.",
                1
        );

        assertNotNull(savedAnnouncement);
        assertEquals("Free Checkups", savedAnnouncement.getTitle());
        verify(userRepository, times(1)).findById(1);
        verify(announcementRepository, times(1)).save(any(Announcement.class));
    }

    @Test
    void testGetAllAnnouncements_ReturnsList() {
        Announcement a1 = new Announcement();
        a1.setTitle("Announcement 1");

        Announcement a2 = new Announcement();
        a2.setTitle("Announcement 2");

        when(announcementRepository.findAllByOrderByCreatedAtDesc()).thenReturn(Arrays.asList(a1, a2));

        List<Announcement> results = announcementService.getAllAnnouncements();
        assertNotNull(results);
        assertEquals(2, results.size());
        verify(announcementRepository, times(1)).findAllByOrderByCreatedAtDesc();
    }
}