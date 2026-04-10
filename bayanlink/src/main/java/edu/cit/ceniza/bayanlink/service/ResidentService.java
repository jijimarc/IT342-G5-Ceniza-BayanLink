package edu.cit.ceniza.bayanlink.service;

import edu.cit.ceniza.bayanlink.dto.ResidentDTO;
import edu.cit.ceniza.bayanlink.entity.Resident;
import edu.cit.ceniza.bayanlink.repository.ResidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResidentService {

    private final ResidentRepository residentRepository;

    public ResidentDTO getResidentByUserId(Integer userId) {
        Resident resident = residentRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Resident profile not found for user ID: " + userId));
        return convertToDTO(resident);
    }

    public List<ResidentDTO> getAllResidents() {
        List<Resident> residents = residentRepository.findAll();
        
        return residents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ResidentDTO convertToDTO(Resident resident) {
        ResidentDTO dto = new ResidentDTO();
        dto.setResidentId(resident.getResidentId());
        
        dto.setUserId(resident.getUser().getUserId());
        
        String middle = resident.getUser().getUserMiddlename() != null ? " " + resident.getUser().getUserMiddlename() + " " : " ";
        dto.setFullName(resident.getUser().getUserFirstname() + middle + resident.getUser().getUserLastname());
        
        dto.setUserEmail(resident.getUser().getUserEmail());
        dto.setUserBirthdate(resident.getUser().getUserBirthdate());
        dto.setAge(resident.getUser().getAge());
        
        dto.setAddress(resident.getAddress());
        dto.setContactNumber(resident.getContactNumber());
        dto.setCivilStatus(resident.getCivilStatus());
        dto.setVoterStatus(resident.getVoterStatus());
        dto.setOccupation(resident.getOccupation());
        
        return dto;
    }
}