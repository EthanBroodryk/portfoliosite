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


const beforePhotos = job.photos?.filter(photo => photo.type === "before") || [];
const afterPhotos = job.photos?.filter(photo => photo.type === "after") || [];

const formatTime = (time?: string) => {
  if (!time) return "N/A";
  return time.slice(0, 5); // "12:30:00" → "12:30"
};

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
  {/* <div className="text-sm text-center sm:text-right w-full sm:w-auto space-y-1">

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

    <p>
      <strong>{job.branch?.name === "OP"
        ? "Reg No: 2023/137229/07"
        : "Reg No: 2020/128226/07"}</strong>
    </p>


    <p>
      <strong>{job.branch?.name === "OP"
        ? "Vat No: 4360317418"
        : "Vat No: 4530300880"}</strong>
    </p>



    <p><strong>Tienie:</strong> 072 788 7431</p>
    <p><strong>Rochelle:</strong> 082 452 3653</p>

    <p>admin@obsessivegen.co.za</p>
  </div> */}

  {/* RIGHT: JOB + COMPANY INFO */}
<div className="text-sm text-center sm:text-right w-full sm:w-auto space-y-1 leading-snug">

  {/* Job Number */}
  <div className="text-red-600 font-bold text-lg tracking-wide">
    {job.job_number}
  </div>

  {/* Company Name */}
  <div className="font-semibold text-gray-900">
    {job.branch?.name === "OP"
      ? "Obsessive Projects (PTY) Ltd"
      : "Obsessive Generators (PTY) Ltd"}
  </div>

  {/* Address */}
  <div className="text-gray-600">
    <div>Unit 7, Factoria Industrial Estate</div>
    <div>25 Louis Friedman Drive, Factoria, 1739</div>
  </div>

  {/* Divider */}
  <div className="border-t my-2 opacity-30" />

  {/* Company Details */}
  <div className="space-y-0.5 text-gray-700">

    <div className="flex justify-center sm:justify-end gap-2">
      <span className="font-medium">Reg No:</span>
      <span>
        {job.branch?.name === "OP"
          ? "2023/137229/07"
          : "2020/128226/07"}
      </span>
    </div>

    <div className="flex justify-center sm:justify-end gap-2">
      <span className="font-medium">VAT No:</span>
      <span>
        {job.branch?.name === "OP"
          ? "4360317418"
          : "4530300880"}
      </span>
    </div>

  </div>

  {/* Divider */}
  <div className="border-t my-2 opacity-30" />

  {/* Contacts */}
  <div className="text-gray-700 space-y-0.5">

    <div>
      <span className="font-medium">Tienie:</span> 072 788 7431
    </div>

    <div>
      <span className="font-medium">Rochelle:</span> 082 452 3653
    </div>

    <div className="text-gray-600 pt-1">
      admin@obsessivegen.co.za
    </div>

  </div>
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
        {/* <div className="w-full border-b pb-2">
          <p>
            <strong>Call Out Time:</strong> {job.call_out_time || "N/A"}
          </p>
        </div> */}

        {/* START + END TIME */}
        <div className="grid grid-cols-2 gap-4 w-full border-b pb-2">
          <p>
            <strong>Start Time:</strong> {formatTime(job.start_time)}
          </p>

          <p>
            <strong>End Time:</strong> {formatTime(job.end_time)}
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
        {/* <div className="w-full border-b pb-2">
          <p>
            <strong>Call Out Type:</strong> {job.call_out_type || "N/A"}
          </p>
        </div> */}

        {/* NORMAL HOURS */}
        {/* <div className="w-full border-b pb-2">
          <p>
            <strong>Normal Hrs:</strong> {job.normal_hours || "N/A"}
          </p>
        </div> */}

        {/* LABOUR + TRAVEL */}
        {/* <div className="grid grid-cols-2 gap-4 w-full border-b pb-2">
          <p>
            <strong>Labour @ Hours:</strong> {job.labour_hours ?? "N/A"}
          </p>

          <p>
            <strong>Traveling @ KM:</strong> {job.travel_km ?? "N/A"}
          </p>
        </div> */}

        {/* Description */}
        <div className="w-full border-b pb-2">
          <p>
            <strong>Description:</strong> {job.description || "N/A"}
          </p>
        </div>

      </div>



<div className="mt-4 space-y-1 text-sm">
  <p><strong>Engine Serial No:</strong> {job.engine_serial_nr || "N/A"}</p>
  <p><strong>Engine Model No:</strong> {job.engine_model_nr || "N/A"}</p>
  <p><strong>Run Hours:</strong> {job.run_hours || "N/A"}</p>
</div>


    {/* Remarks */}
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

      {/* disclosure */}
      <p className="text-lg font-bold mt-4">
        All equipment remains the property of{" "}
        {job.branch?.name === "OP"
          ? "Obsessive Projects (PTY) Ltd"
          : "Obsessive Generators (PTY) Ltd"}{" "}
        until paid in full
      </p>
      {/* Satisfaction Text (ADDED HERE) */}
      <p className="text-lg mt-4">
        I, {job.to} am satisfied that the work has been completed.
      </p>

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

        {/* <div className="text-sm text-right">
          <p>________________________</p>
          <p>Authorized Signature</p>
        </div> */}

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