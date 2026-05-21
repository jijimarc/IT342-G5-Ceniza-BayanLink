package edu.cit.ceniza.mobile.network

import android.os.Build
import edu.cit.ceniza.mobile.BuildConfig
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {

    private const val EMULATOR_LOCAL_URL = "http://10.0.2.2:8080/"
    private const val PHYSICAL_LOCAL_URL = "http://10.0.2.2:8080/"
    private const val LIVE_URL = "https://bayanlink-api.onrender.com/"

    private val BASE_URL = if (BuildConfig.DEBUG) {
        val isEmulator = Build.FINGERPRINT.startsWith("generic")
                || Build.FINGERPRINT.startsWith("unknown")
                || Build.MODEL.contains("google_sdk")
                || Build.MODEL.contains("Emulator")
                || Build.MODEL.contains("Android SDK built for x86")

        if (isEmulator) EMULATOR_LOCAL_URL else PHYSICAL_LOCAL_URL
    } else {
        LIVE_URL
    }

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    val instance: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
}