export default function OfflineJobCards({ isOnline, storedJobCards }) {
    if (isOnline) return null;

    return (
        <div className="mt-4 p-4 border rounded-xl bg-yellow-100">
            <h2 className="text-lg font-bold">Offline Job Cards</h2>
            <table className="w-full mt-2 border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Client</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {storedJobCards.map((card: any) => (
                        <tr key={card.id} className="border">
                            <td className="p-2 border">{card.id}</td>
                            <td className="p-2 border">{card.client || "N/A"}</td>
                            <td className="p-2 border">{card.status}</td>
                            <td className="p-2 border">{card.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}