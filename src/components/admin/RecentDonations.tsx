
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Donation {
  id: string;
  amount: number;
  payment_status: string;
  campaigns: {
    title: string;
  };
  donor: {
    full_name: string;
  };
  created_at: string;
}

interface RecentDonationsProps {
  donations: Donation[];
}

export function RecentDonations({ donations }: RecentDonationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Donations 💝</CardTitle>
        <CardDescription>Latest donations across all campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations?.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">
                    {donation.campaigns?.title || "Unknown Campaign"}
                  </TableCell>
                  <TableCell>
                    {donation.donor?.full_name || "Anonymous"}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "ETB",
                    }).format(donation.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        donation.payment_status === "completed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {donation.payment_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
