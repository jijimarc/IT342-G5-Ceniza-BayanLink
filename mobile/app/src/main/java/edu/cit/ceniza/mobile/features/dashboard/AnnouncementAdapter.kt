package edu.cit.ceniza.mobile.features.dashboard

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.ceniza.mobile.R

class AnnouncementAdapter(private val announcementList: List<Announcement>) :
    RecyclerView.Adapter<AnnouncementAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvTitle: TextView = view.findViewById(R.id.tvAnnouncementTitle)
        val tvMessage: TextView = view.findViewById(R.id.tvAnnouncementMessage)
        val tvDate: TextView = view.findViewById(R.id.tvAnnouncementDate)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_announcement, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val announcement = announcementList[position]
        holder.tvMessage.text = announcement.content
        holder.tvTitle.text = announcement.title
    }

    override fun getItemCount(): Int {
        return announcementList.size
    }
}