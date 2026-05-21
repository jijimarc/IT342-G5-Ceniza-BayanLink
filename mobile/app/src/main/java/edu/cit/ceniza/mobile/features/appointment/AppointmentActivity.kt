package edu.cit.ceniza.mobile.features.appointment

import android.app.DatePickerDialog
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.os.Build
import android.view.View
import android.widget.AdapterView
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import edu.cit.ceniza.mobile.R
import edu.cit.ceniza.mobile.auth.LoginActivity
import edu.cit.ceniza.mobile.auth.SessionManager
import edu.cit.ceniza.mobile.features.dashboard.DashboardActivity
import edu.cit.ceniza.mobile.features.document.DocumentActivity
import edu.cit.ceniza.mobile.features.notifications.NotificationActivity
import edu.cit.ceniza.mobile.features.profile.ProfileActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.Calendar

class AppointmentActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var spinnerService: Spinner
    private lateinit var tvDatePicker: TextView
    private lateinit var etAppointmentNotes: EditText
    private lateinit var tvSummary: TextView
    private lateinit var btnSubmitAppointment: Button
    private lateinit var sessionManager: SessionManager
    private var selectedTimeSlot: String? = null
    private var timeButtonsList = ArrayList<Button>()
    private lateinit var navigationView: NavigationView
    override fun onResume() {
        super.onResume()
        if (::navigationView.isInitialized) {
            navigationView.setCheckedItem(R.id.nav_appointments)
        }
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_appointment)
        sessionManager = SessionManager(this)
        bindViews()
        setupDrawerNavigation()
        setupTimeSlotSelection()

        tvDatePicker.setOnClickListener {
            val calendar = Calendar.getInstance()
            val year = calendar.get(Calendar.YEAR)
            val month = calendar.get(Calendar.MONTH)
            val day = calendar.get(Calendar.DAY_OF_MONTH)

            val datePickerDialog = DatePickerDialog(this, { _, selectedYear, selectedMonth, selectedDay ->
                val formattedDate = String.format("%04d-%02d-%02d", selectedYear, selectedMonth + 1, selectedDay)
                tvDatePicker.text = formattedDate
                tvDatePicker.setTextColor(Color.WHITE)
                updateSummaryText()
            }, year, month, day)

            datePickerDialog.show()
        }

        spinnerService.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                updateSummaryText()
            }
            override fun onNothingSelected(parent: AdapterView<*>?) {}
        }

        val appointmentService = edu.cit.ceniza.mobile.network.ApiClient.instance.create(AppointmentService::class.java)

        btnSubmitAppointment.setOnClickListener {
            executeBooking(appointmentService)
        }
    }

    private fun bindViews() {
        drawerLayout = findViewById(R.id.drawerLayout)
        spinnerService = findViewById(R.id.spinnerService)
        tvDatePicker = findViewById(R.id.tvDatePicker)
        etAppointmentNotes = findViewById(R.id.etAppointmentNotes)
        tvSummary = findViewById(R.id.tvSummary)
        btnSubmitAppointment = findViewById(R.id.btnSubmitAppointment)
    }

    private fun setupTimeSlotSelection() {
        val buttonIds = listOf(
            R.id.btnTime8AM, R.id.btnTime9AM, R.id.btnTime10AM, R.id.btnTime11AM,
            R.id.btnTime1PM, R.id.btnTime2PM, R.id.btnTime3PM, R.id.btnTime4PM
        )

        for (id in buttonIds) {
            val btn = findViewById<Button>(id)
            timeButtonsList.add(btn)

            btn.setOnClickListener { clickedButton ->
                val selectedBtn = clickedButton as Button

                for (button in timeButtonsList) {
                    button.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#334155"))
                    button.setTextColor(Color.parseColor("#E2E8F0"))
                }

                selectedBtn.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#3B82F6"))
                selectedBtn.setTextColor(Color.WHITE)

                selectedTimeSlot = selectedBtn.text.toString()
                updateSummaryText()
            }
        }
    }

    private fun updateSummaryText() {
        val service = spinnerService.selectedItem?.toString() ?: ""
        val date = tvDatePicker.text.toString()
        val time = selectedTimeSlot ?: "None Selected"

        if (service.contains("Select") || date == "dd/mm/yyyy" || selectedTimeSlot == null) {
            tvSummary.text = "Your scheduling summary will appear here..."
            tvSummary.setTextColor(Color.parseColor("#64748B"))
        } else {
            tvSummary.text = "Service: $service\nDate: $date\nTime Slot: $time"
            tvSummary.setTextColor(Color.WHITE)
        }
    }

    private fun executeBooking(service: AppointmentService) {
        val chosenService = spinnerService.selectedItem.toString()
        val chosenDate = tvDatePicker.text.toString()
        val chosenTime = selectedTimeSlot ?: return
        val notes = etAppointmentNotes.text.toString().trim()

        if (chosenService.contains("Select") || chosenDate == "dd/mm/yyyy") {
            Toast.makeText(this, "Please complete all fields.", Toast.LENGTH_SHORT).show()
            return
        }

        val userId = sessionManager.fetchUserId().toInt()
        val token = sessionManager.fetchAuthToken()

        if (userId == -1 || token == null) {
            Toast.makeText(this, "Session expired. Please log in again.", Toast.LENGTH_SHORT).show()
            return
        }

        val formattedTime = when (chosenTime) {
            "8 AM", "8:00 AM" -> "08:00 AM"
            "9 AM", "9:00 AM" -> "09:00 AM"
            "10 AM", "10:00 AM" -> "10:00 AM"
            "11 AM", "11:00 AM" -> "11:00 AM"
            "1 PM", "1:00 PM" -> "01:00 PM"
            "2 PM", "2:00 PM" -> "02:00 PM"
            "3 PM", "3:00 PM" -> "03:00 PM"
            "4 PM", "4:00 PM" -> "04:00 PM"
            else -> chosenTime // Fallback
        }

        val payload = AppointmentRequestPayload(
            userId = userId,
            serviceType = chosenService,
            appointmentDate = chosenDate,
            timeSlot = formattedTime,
            notes = notes
        )

        btnSubmitAppointment.isEnabled = false
        btnSubmitAppointment.text = "Processing..."

        service.bookAppointment("Bearer $token", payload).enqueue(object : Callback<AppointmentResponse> {
            override fun onResponse(call: Call<AppointmentResponse>, response: Response<AppointmentResponse>) {
                btnSubmitAppointment.isEnabled = true
                btnSubmitAppointment.text = "Book Appointment"

                if (response.isSuccessful) {
                    val refNumber = response.body()?.referenceNumber ?: "Unknown"
                    Toast.makeText(this@AppointmentActivity, "Success! Ref: $refNumber", Toast.LENGTH_LONG).show()
                    resetForm()
                } else {
                    Toast.makeText(this@AppointmentActivity, "Booking failed on server.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<AppointmentResponse>, t: Throwable) {
                btnSubmitAppointment.isEnabled = true
                btnSubmitAppointment.text = "Book Appointment"
                Toast.makeText(this@AppointmentActivity, "Network Error", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun resetForm() {
        spinnerService.setSelection(0)
        tvDatePicker.text = "dd/mm/yyyy"
        tvDatePicker.setTextColor(Color.parseColor("#475569"))
        etAppointmentNotes.text.clear()
        selectedTimeSlot = null

        for (button in timeButtonsList) {
            button.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#334155"))
            button.setTextColor(Color.parseColor("#E2E8F0"))
        }
        updateSummaryText()
    }

    private fun setupDrawerNavigation() {
        val toolbar = findViewById<Toolbar>(R.id.topToolbar)
        setSupportActionBar(toolbar)
        navigationView = findViewById(R.id.navigationView)

        val toggle = ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open_nav, R.string.close_nav)
        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()

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
}