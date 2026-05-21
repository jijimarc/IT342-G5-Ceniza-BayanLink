package edu.cit.ceniza.mobile.features.dashboard

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.ceniza.mobile.R

class ServiceAdapter(private val serviceList: List<BarangayService>) :
    RecyclerView.Adapter<ServiceAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvService: TextView = view.findViewById(R.id.tvService)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_service, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val service = serviceList[position]
        holder.tvService.text = service.serviceName
    }

    override fun getItemCount() = serviceList.size
}