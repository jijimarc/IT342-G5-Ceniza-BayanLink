package edu.cit.ceniza.bayanlink.user.official;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officials")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class OfficialController {

    private final OfficialService officialService;

    @GetMapping("/directory")
    public ResponseEntity<List<OfficialDTO>> getDirectory() {
        List<OfficialDTO> directory = officialService.getAllOfficials();
        return ResponseEntity.ok(directory);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<OfficialDTO> getOfficialProfile(@PathVariable("userId") Integer userId) {
        OfficialDTO profile = officialService.getOfficialByUserId(userId);
        return ResponseEntity.ok(profile);
    }
}