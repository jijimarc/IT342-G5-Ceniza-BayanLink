package edu.cit.ceniza.bayanlink.document.strategy;

import edu.cit.ceniza.bayanlink.document.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("COMMUNITY_TAX_CERTIFICATE_STRATEGY")
public class CommunityTaxCertificateStrategy implements DocumentProcessingStrategy {

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
                <h2 style="margin: 15px 0; color: #1e3a8a; text-transform: uppercase;">Office of the Barangay Treasurer</h2>
            </div>
            
            <h1 style="text-align: center; text-decoration: underline; margin-bottom: 40px;">COMMUNITY TAX REVENUE SUMMARY</h1>
            
            <p style="font-size: 1.2em;"><strong>TO WHOM IT MAY CONCERN:</strong></p>
            
            <p style="font-size: 1.2em; line-height: 1.8; text-indent: 40px; text-align: justify;">
                This acts as formal confirmation that <strong>{{residentName}}</strong>, <strong>{{civilStatus}}</strong>, 
                residing at <strong>{{address}}</strong>, has fully fulfilled community tax compliance assessments at our local treasury desks.
            </p>
            
            <p style="font-size: 1.2em; line-height: 1.8; text-indent: 40px; text-align: justify;">
                This transaction report is generated under official filing records upon special request for tracking or validating local application needs involving: 
                <strong>{{purpose}}</strong>.
            </p>
            
            <p style="font-size: 1.2em; margin-top: 40px;">
                Issued this <strong>{{currentDate}}</strong> at Dalaguete, Cebu, Philippines.
            </p>
            
            <div style="margin-top: 80px; text-align: right;">
                <p style="margin: 0; text-transform: uppercase; font-weight: bold;">Barangay Treasury Desk Officer</p>
                <p style="margin: 0;">Office of the Treasurer</p>
            </div>
        </div>
        """;
    }
}