package edu.cit.ceniza.bayanlink.service;

import edu.cit.ceniza.bayanlink.dto.OfficialDTO;
import edu.cit.ceniza.bayanlink.entity.Official;
import edu.cit.ceniza.bayanlink.repository.OfficialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfficialService {

    private final OfficialRepository officialRepository;

    public OfficialDTO getOfficialByUserId(Integer userId) {
        Official official = officialRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Official profile not found for user ID: " + userId));
        return convertToDTO(official);
    }

    public List<OfficialDTO> getAllOfficials() {
        List<Official> officials = officialRepository.findAll();
        
        return officials.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private OfficialDTO convertToDTO(Official official) {
        OfficialDTO dto = new OfficialDTO();
        dto.setOfficialId(official.getOfficialId());
        
        dto.setUserId(official.getUser().getUserId());
        dto.setFullName(official.getUser().getUserFirstname() + " " + official.getUser().getUserLastname());
        dto.setUserEmail(official.getUser().getUserEmail());
        
        dto.setAddress(official.getAddress());
        dto.setContactNumber(official.getContactNumber());
        dto.setPositionTitle(official.getPosition());
        dto.setTermStart(official.getTermStart());
        dto.setTermEnd(official.getTermEnd());
        
        return dto;
    }
}