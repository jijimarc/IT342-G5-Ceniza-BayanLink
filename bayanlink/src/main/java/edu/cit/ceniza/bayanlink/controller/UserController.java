package edu.cit.ceniza.bayanlink.controller;

import edu.cit.ceniza.bayanlink.dto.LoginDTO;
import edu.cit.ceniza.bayanlink.dto.ProfileDTO;
import edu.cit.ceniza.bayanlink.dto.RegisterDTO;
import edu.cit.ceniza.bayanlink.entity.User;
import edu.cit.ceniza.bayanlink.service.AuthenticationService;
import edu.cit.ceniza.bayanlink.service.ProfileService;
import edu.cit.ceniza.bayanlink.service.RegisterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final RegisterService registerService;
    private final AuthenticationService authenticationService;
    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterDTO data) {
        User newUser = registerService.register(data);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO data) {
        Map<String, Object> response = authenticationService.login(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileDTO> getProfile(@PathVariable int id) {
        ProfileDTO profile = profileService.getProfile(id);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody ProfileDTO data) {
        User updatedUser = profileService.updateProfile(data);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable int id) {
        profileService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}