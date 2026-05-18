package edu.cit.ceniza.bayanlink.user.resident;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/residents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResidentController {

    private final ResidentService residentService;

    @GetMapping("/directory")
    public ResponseEntity<List<ResidentDTO>> getAllResidents() {
        List<ResidentDTO> directory = residentService.getAllResidents();
        return ResponseEntity.ok(directory);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResidentDTO> getResidentProfile(@PathVariable("userId") Integer userId) {
        ResidentDTO profile = residentService.getResidentByUserId(userId);
        return ResponseEntity.ok(profile);
    }
}