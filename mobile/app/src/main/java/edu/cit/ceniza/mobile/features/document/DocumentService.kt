package edu.cit.ceniza.mobile.features.document

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

interface DocumentService {

    @POST("api/resident/{userId}/documents")
    fun submitDocumentRequest(
        @Path("userId") userId: Long,
        @Header("Authorization") token: String,
        @Body request: DocumentRequestPayload
    ): Call<DocumentResponse>

    @GET("api/resident/{userId}/documents/pending")
    fun getPendingDocuments(
        @Path("userId") userId: Long,
        @Header("Authorization") token: String
    ): Call<List<PendingDocument>>
}