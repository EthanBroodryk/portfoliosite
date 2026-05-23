import { useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import OfflineJobCardModal from "./offline/offline-job-card-modal";

type Props = {
  isOnline: boolean;
  storedJobCards: any[];
};

export default function OfflineJobCards({
  isOnline,
  storedJobCards,
}: Props) {
  const [selectedCard, setSelectedCard] = useState<any | null>(null);

  const handleSelect = (card: any) => {
    setSelectedCard(card);
  };

  return (
    <>
      {/* OFFLINE UI ONLY */}
      {!isOnline && (
        <Card className="mt-4 border-white-400 bg-white-50">
          <CardHeader>
            <CardTitle>Offline Job Cards</CardTitle>
          </CardHeader>

          <CardContent>
            {storedJobCards?.length === 0 ? (
              <div className="text-sm text-gray-500">
                No offline job cards available
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {storedJobCards?.map((card: any) => (
                    <TableRow
                      key={card.id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelect(card)}
                    >
                      <TableCell>{card.id}</TableCell>
                      <TableCell>{card.client || "N/A"}</TableCell>
                      <TableCell>{card.status}</TableCell>
                      <TableCell>{card.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* MODAL SAFE MOUNT (ONLY WHEN CARD EXISTS) */}
      {selectedCard && (
        <OfflineJobCardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}