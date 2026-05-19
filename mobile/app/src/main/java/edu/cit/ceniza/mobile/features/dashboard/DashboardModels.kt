package edu.cit.ceniza.mobile.features.dashboard

data class DashboardSummaryResponse(
    val announcements: List<Announcement>,
    val presentStaff: List<Staff>,
    val pendingDocuments: List<DocumentRequest>,
    val pendingAppointments: List<Appointment>
)

data class Announcement(
    val id: Long,
    val title: String,
    val message: String,
    val datePosted: String
)

data class Staff(
    val id: Long,
    val fullName: String,
    val role: String
)

data class DocumentRequest(
    val id: Long,
    val documentType: String,
    val status: String,
    val requestDate: String
)

data class Appointment(
    val id: Long,
    val serviceName: String,
    val scheduledDate: String,
    val status: String
)