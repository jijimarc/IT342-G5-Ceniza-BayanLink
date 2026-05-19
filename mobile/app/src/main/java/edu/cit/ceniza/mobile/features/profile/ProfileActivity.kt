package edu.cit.ceniza.mobile.features.profile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
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
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class ProfileActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private var isEditMode = false
    private lateinit var etFirstName: EditText
    private lateinit var etMiddleName: EditText
    private lateinit var etLastName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etContact: EditText
    private lateinit var etBirthdate: EditText
    private lateinit var etAge: EditText
    private lateinit var etAddress: EditText
    private lateinit var etCivilStatus: EditText
    private lateinit var etOccupation: EditText
    private lateinit var etVoterStatus: EditText
    private lateinit var btnEditProfile: Button
    private lateinit var btnCancelEdit: Button
    private var cachedProfile: ResidentProfile? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        bindViews()
        setupDrawerNavigation()

        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8080/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        val profileService = retrofit.create(ProfileService::class.java)

        fetchProfileData(profileService)

        btnEditProfile.setOnClickListener {
            if (!isEditMode) {
                toggleEditMode(true)
            } else {
                saveProfileData(profileService)
            }
        }

        btnCancelEdit.setOnClickListener {
            toggleEditMode(false)
            cachedProfile?.let {
                etFirstName.setText(it.firstName)
                etMiddleName.setText(it.middleName)
                etLastName.setText(it.lastName)
                etEmail.setText(it.email)
                etContact.setText(it.contactNumber)
                etBirthdate.setText(it.birthDate)
                etAge.setText(it.age)
                etAddress.setText(it.address)
                etCivilStatus.setText(it.civilStatus)
                etOccupation.setText(it.occupation)
                etVoterStatus.setText(it.voterStatus)
            }
            Toast.makeText(this, "Edits discarded", Toast.LENGTH_SHORT).show()
        }
    }

    private fun bindViews() {
        drawerLayout = findViewById(R.id.drawerLayout)
        etFirstName = findViewById(R.id.etFirstName)
        etMiddleName = findViewById(R.id.etMiddleName)
        etLastName = findViewById(R.id.etLastName)
        etEmail = findViewById(R.id.etEmail)
        etContact = findViewById(R.id.etContact)
        etBirthdate = findViewById(R.id.etBirthdate)
        etAge = findViewById(R.id.etAge)
        etAddress = findViewById(R.id.etAddress)
        etCivilStatus = findViewById(R.id.etCivilStatus)
        etOccupation = findViewById(R.id.etOccupation)
        etVoterStatus = findViewById(R.id.etVoterStatus)
        btnEditProfile = findViewById(R.id.btnEditProfile)
        btnCancelEdit = findViewById(R.id.btnCancelEdit)
    }

    private fun toggleEditMode(enable: Boolean) {
        isEditMode = enable

        etFirstName.isEnabled = enable
        etMiddleName.isEnabled = enable
        etLastName.isEnabled = enable
        etContact.isEnabled = enable
        etBirthdate.isEnabled = enable
        etAge.isEnabled = enable
        etAddress.isEnabled = enable
        etCivilStatus.isEnabled = enable
        etOccupation.isEnabled = enable
        etVoterStatus.isEnabled = enable

        etEmail.isEnabled = false

        if (enable) {
            btnEditProfile.text = "Save Changes"
            btnEditProfile.setBackgroundColor(android.graphics.Color.parseColor("#10B981"))
            btnCancelEdit.visibility = android.view.View.VISIBLE
        } else {
            btnEditProfile.text = "Edit Profile"
            btnEditProfile.setBackgroundColor(android.graphics.Color.parseColor("#3B82F6"))
            btnCancelEdit.visibility = android.view.View.GONE
        }
    }

    private fun fetchProfileData(service: ProfileService) {
        val testUserId = 1L
        val testToken = "Bearer placeholder_token"

        service.getResidentProfile(testUserId, testToken).enqueue(object : Callback<ResidentProfile> {
            override fun onResponse(call: Call<ResidentProfile>, response: Response<ResidentProfile>) {
                if (response.isSuccessful) {
                    val profile = response.body()
                    profile?.let {
                        cachedProfile = it
                        etFirstName.setText(it.firstName)
                        etMiddleName.setText(it.middleName)
                        etLastName.setText(it.lastName)
                        etEmail.setText(it.email)
                        etContact.setText(it.contactNumber)
                        etBirthdate.setText(it.birthDate)
                        etAge.setText(it.age)
                        etAddress.setText(it.address)
                        etCivilStatus.setText(it.civilStatus)
                        etOccupation.setText(it.occupation)
                        etVoterStatus.setText(it.voterStatus)
                    }
                }
            }
            override fun onFailure(call: Call<ResidentProfile>, t: Throwable) {
                Toast.makeText(this@ProfileActivity, "Failed to load profile", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun saveProfileData(service: ProfileService) {
        btnEditProfile.isEnabled = false
        btnEditProfile.text = "Saving..."

        val updatedData = ResidentProfile(
            firstName = etFirstName.text.toString(),
            middleName = etMiddleName.text.toString(),
            lastName = etLastName.text.toString(),
            email = etEmail.text.toString(),
            contactNumber = etContact.text.toString(),
            birthDate = etBirthdate.text.toString(),
            age = etAge.text.toString(),
            address = etAddress.text.toString(),
            civilStatus = etCivilStatus.text.toString(),
            occupation = etOccupation.text.toString(),
            voterStatus = etVoterStatus.text.toString()
        )

        service.updateResidentProfile(1L, "Bearer placeholder_token", updatedData).enqueue(object : Callback<ProfileUpdateResponse> {
            override fun onResponse(call: Call<ProfileUpdateResponse>, response: Response<ProfileUpdateResponse>) {
                btnEditProfile.isEnabled = true
                if (response.isSuccessful) {
                    Toast.makeText(this@ProfileActivity, "Profile Updated Successfully!", Toast.LENGTH_SHORT).show()
                    toggleEditMode(false)
                } else {
                    Toast.makeText(this@ProfileActivity, "Update Failed", Toast.LENGTH_SHORT).show()
                    toggleEditMode(true)
                }
            }

            override fun onFailure(call: Call<ProfileUpdateResponse>, t: Throwable) {
                btnEditProfile.isEnabled = true
                Toast.makeText(this@ProfileActivity, "Network Error", Toast.LENGTH_SHORT).show()
                toggleEditMode(true)
            }
        })
    }

    private fun setupDrawerNavigation() {
        val toolbar = findViewById<Toolbar>(R.id.topToolbar)
        setSupportActionBar(toolbar)

        val toggle = ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open_nav, R.string.close_nav)
        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()

        val navigationView = findViewById<NavigationView>(R.id.navigationView)

        navigationView.setCheckedItem(R.id.nav_profile)

        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_dashboard -> {
                    val intent = Intent(this, DashboardActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
                    startActivity(intent)
                }
                R.id.nav_profile -> {
                    // Current page
                }
                R.id.nav_logout -> {
                    val intent = Intent(this, LoginActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
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