package edu.cit.ceniza.mobile.features.dashboard

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.navigation.NavigationView
import edu.cit.ceniza.mobile.R
import edu.cit.ceniza.mobile.auth.LoginActivity
import edu.cit.ceniza.mobile.auth.SessionManager
import edu.cit.ceniza.mobile.features.appointment.AppointmentActivity
import edu.cit.ceniza.mobile.features.document.DocumentActivity
import edu.cit.ceniza.mobile.features.notifications.NotificationActivity
import edu.cit.ceniza.mobile.features.profile.ProfileActivity
import edu.cit.ceniza.mobile.network.ApiClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class DashboardActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var sessionManager: SessionManager
    private lateinit var navigationView: NavigationView
    override fun onResume() {
        super.onResume()
        if (::navigationView.isInitialized) {
            navigationView.setCheckedItem(R.id.nav_dashboard)
        }
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        sessionManager = SessionManager(this)
        val token = sessionManager.fetchAuthToken()
        val userId = sessionManager.fetchUserId()

        if (token == null || userId == -1L) {
            Toast.makeText(this, "Session expired. Please log in again.", Toast.LENGTH_SHORT).show()
            logoutUser()
            return
        }

        drawerLayout = findViewById(R.id.drawerLayout)
        navigationView = findViewById(R.id.navigationView)
        val toolbar = findViewById<Toolbar>(R.id.topToolbar)
        setSupportActionBar(toolbar)

        val toggle = ActionBarDrawerToggle(
            this, drawerLayout, toolbar, R.string.open_nav, R.string.close_nav
        )
        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()

        fetchDashboardData(userId, "Bearer $token")

        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_dashboard -> { navigateTo(DashboardActivity::class.java) }
                R.id.nav_appointments -> { navigateTo(AppointmentActivity::class.java) }
                R.id.nav_documents -> { navigateTo(DocumentActivity::class.java) }
                R.id.nav_profile -> { navigateTo(ProfileActivity::class.java) }
                R.id.nav_notifications -> { navigateTo(NotificationActivity::class.java) }
                R.id.nav_logout -> {
                    sessionManager.clearSession()
                    val intent = Intent(this, LoginActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
            }
            true
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
                    drawerLayout.closeDrawer(GravityCompat.START)
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    private fun fetchDashboardData(userId: Long, bearerToken: String) {
        val service = ApiClient.instance.create(DashboardService::class.java)

        service.getAnnouncements(bearerToken).enqueue(object : Callback<List<Announcement>> {
            override fun onResponse(call: Call<List<Announcement>>, response: Response<List<Announcement>>) {
                if (response.isSuccessful) {
                    val allAnnouncements = response.body() ?: emptyList()
                    val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
                    val today = dateFormat.format(Date())
                    val todayAnnouncements = allAnnouncements.filter { it.createdAt.startsWith(today) }
                    val rvAnnouncements = findViewById<RecyclerView>(R.id.rvAnnouncements)
                    rvAnnouncements?.layoutManager = LinearLayoutManager(this@DashboardActivity)
                    rvAnnouncements?.adapter = AnnouncementAdapter(todayAnnouncements)
                }
            }
            override fun onFailure(call: Call<List<Announcement>>, t: Throwable) {}
        })

        service.getOfficials(bearerToken).enqueue(object : Callback<List<Staff>> {
            override fun onResponse(call: Call<List<Staff>>, response: Response<List<Staff>>) {
                if (response.isSuccessful) {
                    val allOfficials = response.body() ?: emptyList()
                    val presentStaff = allOfficials.filter { it.present } // Only show present staff
                    val rvPresentStaff = findViewById<RecyclerView>(R.id.rvPresentStaff)
                    rvPresentStaff?.layoutManager = LinearLayoutManager(this@DashboardActivity)
                    rvPresentStaff?.adapter = StaffAdapter(presentStaff)
                }
            }
            override fun onFailure(call: Call<List<Staff>>, t: Throwable) {}
        })

        service.getClinicServices(bearerToken).enqueue(object : Callback<List<BarangayService>> {
            override fun onResponse(call: Call<List<BarangayService>>, response: Response<List<BarangayService>>) {
                if (response.isSuccessful) {
                    val allServices = response.body() ?: emptyList()
                    val activeServices = allServices.filter { it.available }
                    val rvServices = findViewById<RecyclerView>(R.id.rvServices)
                    rvServices?.layoutManager = LinearLayoutManager(this@DashboardActivity)
                    rvServices?.adapter = ServiceAdapter(activeServices)
                }
            }
            override fun onFailure(call: Call<List<BarangayService>>, t: Throwable) {}
        })

        service.getResidentDocuments(userId, bearerToken).enqueue(object : Callback<List<DocumentRequest>> {
            override fun onResponse(call: Call<List<DocumentRequest>>, response: Response<List<DocumentRequest>>) {
                if (response.isSuccessful) {
                    val allDocs = response.body() ?: emptyList()

                    val pendingCount = allDocs.count {
                        it.status?.toUpperCase(Locale.getDefault())?.contains("PENDING") == true
                    }

                    val tvDocsCount = findViewById<TextView>(R.id.tvPendingDocsCount)
                    tvDocsCount?.text = "$pendingCount Pending"
                }
            }
            override fun onFailure(call: Call<List<DocumentRequest>>, t: Throwable) {
                Log.e("DashboardDocs", "Failed to fetch document count", t)
            }
        })

        service.getResidentAppointments(userId, bearerToken).enqueue(object : Callback<List<Appointment>> {
            override fun onResponse(call: Call<List<Appointment>>, response: Response<List<Appointment>>) {
                if (response.isSuccessful) {
                    val allAppts = response.body() ?: emptyList()

                    val pendingCount = allAppts.count {
                        it.status?.toUpperCase(Locale.getDefault())?.contains("PENDING") == true
                    }

                    findViewById<TextView>(R.id.tvPendingApptCount)?.text = "$pendingCount Pending"
                }
            }
            override fun onFailure(call: Call<List<Appointment>>, t: Throwable) {}
        })
    }

    private fun navigateTo(activityClass: Class<*>) {
        drawerLayout.closeDrawer(GravityCompat.START)

        if (this::class.java == activityClass) return

        val intent = Intent(this, activityClass)
        intent.flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
        startActivity(intent)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            overrideActivityTransition(
                AppCompatActivity.OVERRIDE_TRANSITION_OPEN,
                0,
                0
            )
        } else {
            @Suppress("DEPRECATION")
            overridePendingTransition(0, 0)
        }
    }

    private fun logoutUser() {
        sessionManager.clearSession()
        Toast.makeText(this, "Logging out...", Toast.LENGTH_SHORT).show()
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}