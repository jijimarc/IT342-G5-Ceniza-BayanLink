package edu.cit.ceniza.bayanlink.document.strategy;

import edu.cit.ceniza.bayanlink.document.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("HEALTH_CERTIFICATE_STRATEGY")
public class HealthCertificateStrategy implements DocumentProcessingStrategy {

    @Override
    public void processRequest(DocumentRequest request) {
        request.setStatus("PENDING_APPROVAL");
    }

    @Override
    public String getHtmlTemplate() {
        return """
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; border: 2px solid #000;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h3 style="margin: 0;">Republic of the Philippines</h3>
                <h3 style="margin: 0;">Province of Cebu</h3>
                <h3 style="margin: 0;">Municipality of Dalaguete</h3>
                <h2 style="margin: 15px 0; color: #1e3a8a; text-transform: uppercase;">Barangay Health Center</h2>
            </div>
            
            <h1 style="text-align: center; text-decoration: underline; margin-bottom: 40px;">BARANGAY HEALTH CERTIFICATE</h1>
            
            <p style="font-size: 1.2em;"><strong>TO WHOM IT MAY CONCERN:</strong></p>
            
            <p style="font-size: 1.2em; line-height: 1.8; text-indent: 40px; text-align: justify;">
                This certifies that <strong>{{residentName}}</strong>, residing at <strong>{{address}}</strong>, 
                has undergone physical health status assessments and visual screenings at our regional station desks.
            </p>
            
            <p style="font-size: 1.2em; line-height: 1.8; text-indent: 40px; text-align: justify;">
                At the date of checking, the individual demonstrates healthy vital standings, shows no open indications of communicable outbreaks, and is declared fit to execute standard work tasks.
            </p>
            
            <p style="font-size: 1.2em; line-height: 1.8; text-indent: 40px; text-align: justify;">
                This certification is being issued for: <strong>{{purpose}}</strong>.
            </p>
            
            <p style="font-size: 1.2em; margin-top: 40px;">
                Issued this <strong>{{currentDate}}</strong> at Dalaguete, Cebu, Philippines.
            </p>
            
            <div style="margin-top: 80px; text-align: right;">
                <p style="margin: 0; text-transform: uppercase; font-weight: bold;">Barangay Health Officer / BHW</p>
                <p style="margin: 0;">Health Service Unit</p>
            </div>
        </div>
        """;
    }
}