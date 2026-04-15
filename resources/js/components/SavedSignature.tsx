export default function SavedSignature({ signature }: { signature: string }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Saved Signature</h3>

      <img
        src={signature}
        className="border w-full rounded-md"
      />
    </div>
  );
}