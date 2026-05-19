package edu.cit.ceniza.mobile.features.appointment

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

interface AppointmentService {

    @POST("api/resident/{userId}/appointments")
    fun bookAppointment(
        @Path("userId") userId: Long,
        @Header("Authorization") token: String,
        @Body payload: AppointmentRequestPayload
    ): Call<AppointmentResponse>
}