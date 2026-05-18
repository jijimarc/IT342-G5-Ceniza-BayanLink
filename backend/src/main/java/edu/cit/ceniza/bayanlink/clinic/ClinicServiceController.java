package edu.cit.ceniza.bayanlink.clinic;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clinic-services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClinicServiceController {

    private final ClinicServiceRepository repository;

    @GetMapping
    public ResponseEntity<List<ClinicService>> getAllServices() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<ClinicService> addService(@RequestBody ClinicService service) {
        return ResponseEntity.ok(repository.save(service));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<ClinicService> toggleService(@PathVariable Integer id, @RequestParam boolean isAvailable) {
        ClinicService service = repository.findById(id).orElseThrow();
        service.setAvailable(isAvailable);
        return ResponseEntity.ok(repository.save(service));
    }
}