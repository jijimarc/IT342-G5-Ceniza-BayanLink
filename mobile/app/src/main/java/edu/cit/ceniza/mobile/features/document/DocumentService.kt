package edu.cit.ceniza.mobile.features.document

import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path

interface DocumentService {

    @Multipart
    @POST("api/documents/request")
    fun submitDocumentRequest(
        @Header("Authorization") token: String,
        @Part userId: MultipartBody.Part,
        @Part fullName: MultipartBody.Part,
        @Part documentType: MultipartBody.Part,
        @Part validId: MultipartBody.Part,
        @Part purpose: MultipartBody.Part,
        @Part urgencyLevel: MultipartBody.Part,
        @Part idImage: MultipartBody.Part
    ): Call<PendingDocument>

    @GET("api/documents/user/{userId}")
    fun getResidentDocuments(
        @Path("userId") userId: Long,
        @Header("Authorization") token: String
    ): Call<List<PendingDocument>>
}