package edu.cit.ceniza.mobile.auth

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("BayanLinkAppPrefs", Context.MODE_PRIVATE)

    fun saveAuthToken(token: String) {
        prefs.edit().putString("USER_TOKEN", token).apply()
    }

    fun fetchAuthToken(): String? {
        return prefs.getString("USER_TOKEN", null)
    }

    fun saveUserId(userId: Long) {
        prefs.edit().putLong("USER_ID", userId).apply()
    }

    fun fetchUserId(): Long {
        return prefs.getLong("USER_ID", -1)
    }

    fun saveFullName(fullname: String) {
        prefs.edit().putString("USER_FULLNAME", fullname).apply()
    }

    fun fetchFullName(): String? {
        return prefs.getString("USER_FULLNAME", null)
    }

    fun clearSession() {
        prefs.edit().clear().apply()
    }
}