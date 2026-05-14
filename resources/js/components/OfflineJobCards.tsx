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

export default function OfflineJobCards({ isOnline, storedJobCards }) {
  const [selectedCard, setSelectedCard] = useState<any | null>(null);

  if (isOnline) return null;

  return (
    <>
      {/* Main card */}
      <Card className="mt-4 border-white-400 bg-white-50">
        <CardHeader>
          <CardTitle>Offline Job Cards</CardTitle>
        </CardHeader>

        <CardContent>
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
                <TableRow key={card.id}>
                  <TableCell
                    onClick={() => setSelectedCard(card)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {card.id}
                  </TableCell>

                  <TableCell
                    onClick={() => setSelectedCard(card)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {card.client || "N/A"}
                  </TableCell>

                  <TableCell
                    onClick={() => setSelectedCard(card)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {card.status}
                  </TableCell>

                  <TableCell
                    onClick={() => setSelectedCard(card)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {card.created_at}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Component */}
      <OfflineJobCardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </>
  );
}