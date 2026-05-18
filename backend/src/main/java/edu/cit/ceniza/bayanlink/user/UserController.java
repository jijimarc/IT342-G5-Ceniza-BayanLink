package edu.cit.ceniza.bayanlink.user;

import edu.cit.ceniza.bayanlink.user.auth.AuthenticationService;
import edu.cit.ceniza.bayanlink.user.auth.LoginDTO;
import edu.cit.ceniza.bayanlink.user.auth.RegisterDTO;
import edu.cit.ceniza.bayanlink.user.auth.RegisterService;
import edu.cit.ceniza.bayanlink.user.profile.ProfileDTO;
import edu.cit.ceniza.bayanlink.user.profile.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

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
    public ResponseEntity<User> register(@Valid @RequestBody RegisterDTO data) {

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
    public ResponseEntity<User> updateProfile(@Valid @RequestBody ProfileDTO data) {
        User updatedUser = profileService.updateProfile(data);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable int id) {
        profileService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}