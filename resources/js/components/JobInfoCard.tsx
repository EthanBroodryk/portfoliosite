interface JobCard {
  job_number: string;
  technician: string;
  description: string;
  status: string;
}

export default function JobInfoCard({ job }: { job: JobCard }) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">
        {job.job_number}
      </h2>

      <p><strong>Technician:</strong> {job.technician}</p>
      <p><strong>Status:</strong> {job.status}</p>
      <p><strong>Description:</strong> {job.description}</p>
    </div>
  );
}