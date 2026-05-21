package edu.cit.ceniza.mobile.features.appointment

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface AppointmentService {

    @POST("api/appointments/book")
    fun bookAppointment(
        @Header("Authorization") token: String,
        @Body payload: AppointmentRequestPayload
    ): Call<AppointmentResponse>
}