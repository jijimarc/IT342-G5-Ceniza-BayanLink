package edu.cit.ceniza.mobile.features.dashboard

import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Path

interface DashboardService {

    @GET("api/announcements")
    fun getAnnouncements(@Header("Authorization") token: String): Call<List<Announcement>>

    @GET("api/officials/directory")
    fun getOfficials(@Header("Authorization") token: String): Call<List<Staff>>

    @GET("api/documents/user/{userId}")
    fun getResidentDocuments(
        @Path("userId") userId: Long,
        @Header("Authorization") token: String
    ): Call<List<DocumentRequest>>

    @GET("api/appointments/user/{userId}")
    fun getResidentAppointments(
        @Path("userId") userId: Long,
        @Header("Authorization") token: String
    ): Call<List<Appointment>>

    @GET("api/clinic-services")
    fun getClinicServices(@Header("Authorization") token: String): Call<List<BarangayService>>
}