package edu.cit.ceniza.mobile.features.notifications

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Path

interface NotificationService {

    @GET("api/documents/user/{userId}")
    suspend fun getUserDocuments(
        @Header("Authorization") token: String,
        @Path("userId") userId: Long
    ): Response<List<NotificationDocResponse>>

    @GET("api/appointments/user/{userId}")
    suspend fun getUserAppointments(
        @Header("Authorization") token: String,
        @Path("userId") userId: Long
    ): Response<List<NotificationApptResponse>>
}