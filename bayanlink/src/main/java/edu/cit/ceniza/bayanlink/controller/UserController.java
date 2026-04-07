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

/**
 * ADAPTER PATTERN IMPLEMENTATION
 * * Target Interface: The REST API expected by the frontend (HTTP, JSON).
 * Adaptee: The internal business logic (RegisterService, AuthenticationService).
 * Adapter: This UserController class.
 * * Purpose: It catches incompatible web requests and translates them into
 * standard Java method calls that the backend services can understand.
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    // The "Adaptees" - The internal systems we are adapting the web requests to.
    private final RegisterService registerService;
    private final AuthenticationService authenticationService;
    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterDTO data) {
        // Translation Step: The framework adapts the raw JSON body into a RegisterDTO.
        // The Adapter then calls the Adaptee.
        User newUser = registerService.register(data);

        // Translation Step: Adapting the internal User object back to an HTTP 200 Response.
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO data) {
        Map<String, Object> response = authenticationService.login(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileDTO> getProfile(@PathVariable int id) {
        // Translation Step: Adapting a URL path variable into a Java integer.
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
        // Translation Step: Adapting a successful void execution into an HTTP 204 No Content.
        return ResponseEntity.noContent().build();
    }
}