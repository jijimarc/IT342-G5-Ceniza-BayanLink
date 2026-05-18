package edu.cit.ceniza.bayanlink.document;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    public String uploadFile(MultipartFile file) throws Exception {
        String originalName = file.getOriginalFilename();
        String safeName = originalName != null ? originalName.replaceAll("[^a-zA-Z0-9.-]", "_") : "file";
        String uniqueFileName = UUID.randomUUID().toString() + "-" + safeName;

        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + uniqueFileName;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.set("apikey", supabaseKey);

        String contentType = file.getContentType();
        if (contentType != null) {
            headers.setContentType(MediaType.parseMediaType(contentType));
        } else {
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        }

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);
        ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.POST, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + uniqueFileName;
        } else {
            throw new RuntimeException("Failed to upload to Supabase. Response: " + response.getBody());
        }
    }
}