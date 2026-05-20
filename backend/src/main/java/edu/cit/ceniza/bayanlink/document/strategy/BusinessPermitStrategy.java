package edu.cit.ceniza.bayanlink.document.strategy;

import edu.cit.ceniza.bayanlink.document.DocumentRequest;
import org.springframework.stereotype.Component;

@Component("BUSINESS_PERMIT_STRATEGY")
public class BusinessPermitStrategy implements DocumentProcessingStrategy {

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
                <h2 style="margin: 15px 0; color: #1e3a8a; text-transform: uppercase;">Office of the Barangay Captain</h2>
            </div>
            
            <h1 style="text-align: center; text-decoration: underline; margin-bottom: 40px;">BARANGAY BUSINESS CLEARANCE / PERMIT</h1>
            
            <p style="font-size: 1.2em;"><strong>TO WHOM IT MAY CONCERN:</strong></p>
            
            <p style="font-size: 1.2em; line-height: 1.8; text-indent: 40px; text-align: justify;">
                Clearance is hereby granted to <strong>{{residentName}}</strong>, operating a business establishment under the business scope or purpose of: 
                <strong>{{purpose}}</strong>, located at <strong>{{address}}</strong>, Dalaguete, Cebu.
            </p>
            
            <p style="font-size: 1.2em; line-height: 1.8; text-indent: 40px; text-align: justify;">
                This clearance is issued in accordance with local ordinances and codes provided that all relevant municipal municipal rules, sanitary standards, and environmental requirements are continuously satisfied.
            </p>
            
            <p style="font-size: 1.2em; margin-top: 40px;">
                Issued this <strong>{{currentDate}}</strong> at Dalaguete, Cebu, Philippines.
            </p>
            
            <div style="margin-top: 80px; text-align: right;">
                <p style="margin: 0; text-transform: uppercase; font-weight: bold;">Hon. Barangay Captain Name</p>
                <p style="margin: 0;">Punong Barangay</p>
            </div>
        </div>
        """;
    }
}