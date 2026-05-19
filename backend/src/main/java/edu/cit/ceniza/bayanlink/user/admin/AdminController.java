package edu.cit.ceniza.bayanlink.user.admin;

import edu.cit.ceniza.bayanlink.user.Role;
import edu.cit.ceniza.bayanlink.user.UserResponseDTO;
import edu.cit.ceniza.bayanlink.user.auth.RegisterDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getUsersByType(@RequestParam Role role) {
        return ResponseEntity.ok(adminService.getUsersByType(role));
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createAccount(
            @Valid @RequestBody RegisterDTO data,
            @RequestParam String role) {

        UserResponseDTO createdUser = adminService.createOfficialOrAdmin(data, role);
        return ResponseEntity.ok(createdUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Integer id) {
        adminService.deleteAccount(id);
        return ResponseEntity.ok("Account successfully deleted.");
    }
}