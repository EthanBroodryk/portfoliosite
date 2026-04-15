"use client";

interface JobCard {
  job_number: string;
  technician: string;
  description: string;
  status: string;
  customer_order_no?: string;
  date?: string;
  to?: string;
  call_out_time?: string;
  start_time?: string;
  end_time?: string;
  email?: string;
  tel?: string;
}

export default function JobInfoCard({ job }: { job: JobCard }) {
  return (
    <div className="p-5 border border-border rounded-lg bg-card text-foreground space-y-4">
      
      <h2 className="text-xl font-bold">{job.job_number}</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <div>
          <p className="font-semibold text-muted-foreground">Technician</p>
          <p>{job.technician}</p>
        </div>

        <div>
          <p className="font-semibold text-muted-foreground">Status</p>
          <p>{job.status}</p>
        </div>

        <div>
          <p className="font-semibold text-muted-foreground">Customer Order No</p>
          <p>{job.customer_order_no || "N/A"}</p>
        </div>

        <div>
          <p className="font-semibold text-muted-foreground">Date</p>
          <p>{job.date || "N/A"}</p>
        </div>

        <div>
          <p className="font-semibold text-muted-foreground">To</p>
          <p>{job.to || "N/A"}</p>
        </div>

        <div>
          <p className="font-semibold text-muted-foreground">Call Out Time</p>
          <p>{job.call_out_time || "N/A"}</p>
        </div>

        <div>
          <p className="font-semibold text-muted-foreground">Start Time</p>
          <p>{job.start_time || "N/A"}</p>
        </div>

        <div>
          <p className="font-semibold text-muted-foreground">End Time</p>
          <p>{job.end_time || "N/A"}</p>
        </div>

        <div>
          <p className="font-semibold text-muted-foreground">Email</p>
          <p>{job.email || "N/A"}</p>
        </div>

        <div>
          <p className="font-semibold text-muted-foreground">Tel</p>
          <p>{job.tel || "N/A"}</p>
        </div>

        <div className="col-span-2">
          <p className="font-semibold text-muted-foreground">Description</p>
          <p>{job.description}</p>
        </div>

      </div>
    </div>
  );
}