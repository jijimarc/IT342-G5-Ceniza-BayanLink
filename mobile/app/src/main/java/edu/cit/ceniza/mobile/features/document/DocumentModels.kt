package edu.cit.ceniza.mobile.features.document

data class DocumentRequestPayload(
    val fullName: String,
    val documentType: String,
    val urgencyLevel: String,
    val validIdType: String,
    val purpose: String
)

data class DocumentResponse(
    val message: String,
    val success: Boolean
)

data class PendingDocument(
    val requestId: Long,
    val documentType: String,
    val status: String,
    val requestDate: String?
)