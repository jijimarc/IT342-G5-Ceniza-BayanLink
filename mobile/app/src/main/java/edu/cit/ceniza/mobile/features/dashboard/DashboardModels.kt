package edu.cit.ceniza.mobile.features.dashboard

data class DashboardSummaryResponse(
    val announcements: List<Announcement>,
    val presentStaff: List<Staff>,
    val pendingDocuments: List<DocumentRequest>,
    val pendingAppointments: List<Appointment>,
    val services: List<BarangayService>
)

data class Announcement(
    val id: Long,
    val title: String,
    val content: String,
    val createdAt: String
)

data class Staff(
    val id: Long,
    val fullName: String,
    val position: String,
    val present: Boolean
)

data class DocumentRequest(
    val requestId: Long,
    val documentType: String,
    val status: String,
)

data class Appointment(
    val appointmentId: Long,
    val serviceType: String,
    val appointmentDate: String?,
    val timeSlot: String?,
    val status: String
)

data class BarangayService(
    val id: Long,
    val serviceName: String,
    val description: String?,
    val available: Boolean
)