package edu.cit.ceniza.mobile.features.appointment

import android.app.DatePickerDialog
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
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
import edu.cit.ceniza.mobile.features.dashboard.DashboardActivity
import edu.cit.ceniza.mobile.features.document.DocumentActivity
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

    private var selectedTimeSlot: String? = null
    private var timeButtonsList = ArrayList<Button>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_appointment)

        bindViews()
        setupDrawerNavigation()
        setupTimeSlotSelection()

        tvDatePicker.setOnClickListener {
            val calendar = Calendar.getInstance()
            val year = calendar.get(Calendar.YEAR)
            val month = calendar.get(Calendar.MONTH)
            val day = calendar.get(Calendar.DAY_OF_MONTH)

            val datePickerDialog = DatePickerDialog(this, { _, selectedYear, selectedMonth, selectedDay ->
                val formattedDate = String.format("%02d/%02d/%d", selectedDay, selectedMonth + 1, selectedYear)
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

        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8080/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        val appointmentService = retrofit.create(AppointmentService::class.java)

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
        val chosenTime = selectedTimeSlot
        val notes = etAppointmentNotes.text.toString().trim()

        if (chosenService.contains("Select")) {
            Toast.makeText(this, "Please choose a community service.", Toast.LENGTH_SHORT).show()
            return
        }
        if (chosenDate == "dd/mm/yyyy") {
            Toast.makeText(this, "Please pick an appointment date.", Toast.LENGTH_SHORT).show()
            return
        }
        if (chosenTime == null) {
            Toast.makeText(this, "Please select an available time slot.", Toast.LENGTH_SHORT).show()
            return
        }

        val payload = AppointmentRequestPayload(chosenService, chosenDate, chosenTime, notes)

        btnSubmitAppointment.isEnabled = false
        btnSubmitAppointment.text = "Processing Booking..."

        service.bookAppointment(1L, "Bearer placeholder", payload).enqueue(object : Callback<AppointmentResponse> {
            override fun onResponse(call: Call<AppointmentResponse>, response: Response<AppointmentResponse>) {
                btnSubmitAppointment.isEnabled = true
                btnSubmitAppointment.text = "Book Appointment"

                if (response.isSuccessful) {
                    Toast.makeText(this@AppointmentActivity, "Appointment Scheduled Successfully!", Toast.LENGTH_LONG).show()
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

        val toggle = ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open_nav, R.string.close_nav)
        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()

        val navigationView = findViewById<NavigationView>(R.id.navigationView)
        navigationView.setCheckedItem(R.id.nav_appointments)

        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_dashboard -> startActivity(Intent(this, DashboardActivity::class.java))
                R.id.nav_appointments -> {} // Already here
                R.id.nav_documents -> startActivity(Intent(this, DocumentActivity::class.java))
                R.id.nav_profile -> startActivity(Intent(this, ProfileActivity::class.java))
                R.id.nav_logout -> {
                    val intent = Intent(this, LoginActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    }
                    startActivity(intent)
                    finish()
                }
            }
            drawerLayout.closeDrawer(GravityCompat.START)
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
}