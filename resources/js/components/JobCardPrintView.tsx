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

  call_out_type?: string;
  normal_hours?: string;
  labour_hours?: number;
  travel_km?: number;
  remarks?: string;
}




export default function JobCardPrintView({ job }: { job: JobCard }) {

console.log("Branch data:", job.branch.name);
const beforePhotos = job.photos?.filter(photo => photo.type === "before") || [];
const afterPhotos = job.photos?.filter(photo => photo.type === "after") || [];

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
        className="h-32 sm:h-56 md:h-64 w-auto max-w-[280px] object-contain"
      />
    )}
  </div>

  {/* RIGHT: JOB + COMPANY INFO */}
  <div className="text-sm text-center sm:text-right w-full sm:w-auto space-y-1">

    <strong className="text-red-600 block text-lg">
      {job.job_number}
    </strong>

    <p className="font-bold">
      {job.branch?.name === "OP"
        ? "Obsessive Projects (PTY) Ltd"
        : "Obsessive Generators (PTY) Ltd"}
    </p>
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


      {/* CALL OUT + LABOUR SECTION */}
      <div className="text-sm space-y-2 mb-4 border-t pt-4">

        {/* CALL OUT TYPE */}
        <div className="w-full border-b pb-2">
          <p>
            <strong>Call Out Type:</strong> {job.call_out_type || "N/A"}
          </p>
        </div>

        {/* NORMAL HOURS */}
        <div className="w-full border-b pb-2">
          <p>
            <strong>Normal Hrs:</strong> {job.normal_hours || "N/A"}
          </p>
        </div>

        {/* LABOUR + TRAVEL */}
        <div className="grid grid-cols-2 gap-4 w-full border-b pb-2">
          <p>
            <strong>Labour @ Hours:</strong> {job.labour_hours ?? "N/A"}
          </p>

          <p>
            <strong>Traveling @ KM:</strong> {job.travel_km ?? "N/A"}
          </p>
        </div>

        {/* REMARKS */}
        <div className="w-full border-b pb-2">
          <p>
            <strong>Description:</strong> {job.description || "N/A"}
          </p>
        </div>

      </div>






    {/* DESCRIPTION */}
      <div className="mb-6 border-t pt-4">

        <div className="text-center mb-2">
          <p className="font-bold text-base tracking-wide">
            Remarks
          </p>
        </div>

        <div className="border p-4 min-h-[120px]">
          <p className="whitespace-pre-wrap">
            {job.remarks}
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

      {/* BEFORE PHOTOS */}
      {beforePhotos.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-bold mb-3 text-center">BEFORE PHOTOS</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {beforePhotos.map((photo, i) => (
              <div key={i} className="border p-2">
                <img
                  src={`/storage/${photo.path}`}
                  alt={`Before Photo ${i + 1}`}
                  className="w-full h-40 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AFTER PHOTOS */}
      {afterPhotos.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-bold mb-3 text-center">AFTER PHOTOS</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {afterPhotos.map((photo, i) => (
              <div key={i} className="border p-2">
                <img
                  src={`/storage/${photo.path}`}
                  alt={`After Photo ${i + 1}`}
                  className="w-full h-40 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}