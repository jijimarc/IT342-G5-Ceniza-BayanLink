package edu.cit.ceniza.bayanlink.tests;

import edu.cit.ceniza.bayanlink.user.User;
import edu.cit.ceniza.bayanlink.user.UserRepository;
import edu.cit.ceniza.bayanlink.user.profile.ProfileDTO;
import edu.cit.ceniza.bayanlink.user.profile.ProfileService;
import edu.cit.ceniza.bayanlink.user.resident.Resident;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetProfile_SuccessWithResidentData() {
        User mockUser = new User();
        mockUser.setUserId(1);
        mockUser.setUserFirstname("Juan");
        mockUser.setUserProfileImage("avatar.png");

        Resident mockResident = new Resident();
        mockResident.setAddress("123 Barangay St");
        mockResident.setOccupation("Engineer");
        mockUser.setResidentProfile(mockResident);

        when(userRepository.findById(1)).thenReturn(Optional.of(mockUser));

        ProfileDTO result = profileService.getProfile(1);

        assertNotNull(result);
        assertEquals("Juan", result.getUserFirstname());
        assertEquals("avatar.png", result.getUserProfileImage());
        assertEquals("123 Barangay St", result.getAddress());
        assertEquals("Engineer", result.getOccupation());
    }

    @Test
    void testUpdateProfile_CreatesNewResidentProfileIfNull() {
        User existingUser = new User();
        existingUser.setUserId(2);

        ProfileDTO incomingData = new ProfileDTO();
        incomingData.setUserId(2);
        incomingData.setUserFirstname("Maria");
        incomingData.setAddress("456 New St");

        when(userRepository.findById(2)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User updatedUser = profileService.updateProfile(incomingData);

        assertNotNull(updatedUser);
        assertEquals("Maria", updatedUser.getUserFirstname());
        assertNotNull(updatedUser.getResidentProfile());
        assertEquals("456 New St", updatedUser.getResidentProfile().getAddress());
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    void testGetProfile_UserNotFound_ThrowsException() {
        when(userRepository.findById(99)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            profileService.getProfile(99);
        });
        assertTrue(exception.getMessage().contains("User not found"));
    }
}