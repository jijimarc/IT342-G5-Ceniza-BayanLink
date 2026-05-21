package edu.cit.ceniza.mobile.features.dashboard

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.ceniza.mobile.R

class StaffAdapter(private val staffList: List<Staff>) :
    RecyclerView.Adapter<StaffAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvName: TextView = view.findViewById(R.id.tvStaffName)
        val tvRole: TextView = view.findViewById(R.id.tvStaffRole)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_staff, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val staff = staffList[position]
        holder.tvName.text = staff.fullName
        holder.tvRole.text = staff.position
    }

    override fun getItemCount() = staffList.size
}