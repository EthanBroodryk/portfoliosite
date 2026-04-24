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
<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-4 mb-4 gap-4">

  {/* LEFT: LOGO */}
  <div className="flex justify-center sm:justify-start w-full sm:w-auto">
    {job.branch?.logo && (
      <img
        src={`/storage/${job.branch.logo}`}
        alt="Logo"
        className="h-24 sm:h-40 w-auto object-contain"
      />
    )}
  </div>

  {/* RIGHT: JOB + COMPANY INFO */}
  <div className="text-sm text-center sm:text-right w-full sm:w-auto space-y-1">

    <strong className="text-red-600 block text-lg">
      {job.job_number}
    </strong>

    <p className="font-bold">Obsessive Generators (PTY) Ltd</p>
    <p>Unit 7, Factoria Industrial Estate</p>
    <p>25 Louis Friedman Drive, Factoria, 1739</p>

    <p><strong>Reg No:</strong> 2020/128226/07</p>
    <p><strong>Vat No:</strong> 4530300880</p>

    <p><strong>Tienie:</strong> 072 788 7431</p>
    <p><strong>Rochelle:</strong> 082 452 3653</p>

    <p>admin@obsessivegen.co.za</p>
  </div>

</div>

      {/* TITLE */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold tracking-wide">
          JOB CARD
        </h1>
      </div>

     {/* META ROW */}
      <div className="grid grid-cols-3 w-full text-sm mb-4 border-y py-2">
        <p className="text-left">
          <strong>Date:</strong> {job.date || "N/A"}
        </p>

        <p className="text-center">
          <strong>Tech:</strong> {job.technician}
        </p>

        <p className="text-right">
          <strong>Cust. Order No:</strong> {job.customer_order_no || "N/A"}
        </p>
      </div>

      {/* JOB DETAILS SECTION */}
      <div className="text-sm space-y-2 mb-4">

        {/* TO */}
        <div className="w-full border-b pb-2">
          <p>
            <strong>To:</strong> {job.to || "N/A"}
          </p>
        </div>

        {/* CALL OUT TIME */}
        <div className="w-full border-b pb-2">
          <p>
            <strong>Call Out Time:</strong> {job.call_out_time || "N/A"}
          </p>
        </div>

        {/* START + END TIME */}
        <div className="grid grid-cols-2 gap-4 w-full border-b pb-2">
          <p>
            <strong>Start Time:</strong> {job.start_time || "N/A"}
          </p>

          <p>
            <strong>End Time:</strong> {job.end_time || "N/A"}
          </p>
        </div>

        {/* EMAIL + TEL */}
        <div className="grid grid-cols-2 gap-4 w-full border-b pb-2">
          <p>
            <strong>Email:</strong> {job.email || "N/A"}
          </p>

          <p>
            <strong>Tel:</strong> {job.tel || "N/A"}
          </p>
        </div>

      </div>

    {/* DESCRIPTION */}
      <div className="mb-6 border-t pt-4">

        <div className="text-center mb-2">
          <p className="font-bold text-base tracking-wide">
            DESCRIPTION
          </p>
        </div>

        <div className="border p-4 min-h-[120px]">
          <p className="whitespace-pre-wrap">
            {job.description}
          </p>
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