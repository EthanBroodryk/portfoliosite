"use client";

interface JobCard {
  job_number: string;
  technician: string;
  description: string;
  status: string;

  branch?: {
    id: number;
    name: string;
    logo?: string;
  };

  customer_order_no?: string;
  date?: string;
  to?: string;
  call_out_time?: string;
  start_time?: string;
  end_time?: string;
  email?: string;
  tel?: string;
  signature?: string;
}

export default function JobCardPrintView({ job }: { job: JobCard }) {
  console.log("JOB DATA:", job);
  console.log("BRANCH LOGO:", job.branch?.logo);

  return (
    <div className="bg-white text-black p-6 max-w-4xl mx-auto border">
      {/* HEADER */}
      <div className="flex items-start justify-between border-b pb-4 mb-4">

        {/* LEFT: LOGO */}
        <div className="flex items-center">
          {job.branch?.logo && (
            <img
              src={`/storage/${job.branch.logo}`}
              alt="Logo"
              className="h-40 max-w-[260px] object-contain"
            />
          )}
        </div>

        {/* RIGHT: JOB INFO */}
        <div className="text-right text-sm">
          <strong className="text-red-600">{job.job_number}</strong>
          {/* <h1 className="text-xl font-bold">JOB CARD</h1> */}
          <p><strong>Obsessive Generators (PTY) Ltd</strong></p>
          <p>Unit 7,Factoria Industrial Estate</p>
          <p>25 Louis Friedman Drive Factoria, 1739</p>
          <p><strong>Reg No:</strong>2020/128226/07</p>
          <p><strong>Vat No:</strong>4530300880</p>
          <p><strong>Tienie-</strong>0727887431</p>
          <p><strong>Rochelle-</strong>0824523653</p>
          <p>admin@obsessivegen.co.za</p>
        </div>

      </div>
      {/* CUSTOMER / JOB INFO */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p><strong>To:</strong> {job.to || "N/A"}</p>
          <p><strong>Email:</strong> {job.email || "N/A"}</p>
          <p><strong>Tel:</strong> {job.tel || "N/A"}</p>
        </div>

        <div>
          <p><strong>Technician:</strong> {job.technician}</p>
          <p><strong>Customer Order No:</strong> {job.customer_order_no || "N/A"}</p>
        </div>
      </div>

      {/* TIME INFO */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm border-t pt-3">
        <div>
          <p className="font-semibold">Call Out</p>
          <p>{job.call_out_time || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">Start Time</p>
          <p>{job.start_time || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">End Time</p>
          <p>{job.end_time || "-"}</p>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-6 border-t pt-4">
        <p className="font-semibold mb-2">Work Description</p>

        <div className="border p-4 min-h-[120px]">
          <p className="whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {/* SIGNATURE */}
      <div className="border-t pt-6 flex justify-between items-end">

        <div className="w-1/2">
          <p className="text-sm mb-2 font-semibold">Client Signature</p>

          <div className="border h-24 flex items-center justify-center">
            {job.signature ? (
              <img
                src={`/storage/${job.signature}`}
                className="h-full object-contain"
              />
            ) : (
              <span className="text-xs text-gray-500">
                No signature
              </span>
            )}
          </div>
        </div>

        <div className="text-sm text-right">
          <p>________________________</p>
          <p>Authorized Signature</p>
        </div>

      </div>
    </div>
  );
}