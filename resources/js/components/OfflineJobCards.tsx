import { useState } from "react";
import OfflineJobCardModal from "./offline/offline-job-card-modal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";




type Props = {
  isOnline: boolean;
  storedJobCards: any[];
};

export default function OfflineJobCards({ isOnline, storedJobCards }: Props) {
  const [selectedCard, setSelectedCard] = useState<any | null>(null);

  if (isOnline) return null; // ONLY safe if prop is reliable (now it is)

  return (
    <>
      <Card className="mt-4 border-white-400 bg-white-50">
        <CardHeader>
          <CardTitle>Offline Job Cards</CardTitle>
        </CardHeader>

        <CardContent>
          {storedJobCards?.length ? (
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
                {storedJobCards.map((card: any) => (
                  <TableRow
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell>{card.id}</TableCell>
                    <TableCell>{card.client || "N/A"}</TableCell>
                    <TableCell>{card.status}</TableCell>
                    <TableCell>{card.created_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-sm text-gray-500">
              No offline job cards available
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCard && (
        <OfflineJobCardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}