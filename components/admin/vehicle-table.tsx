"use client";

import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useVehicleStore } from "@/store/vehicle-store";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleLogo } from "@/components/ui/vehicle-logo";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onRefresh?: () => void;
}

export function VehicleTable({ vehicles, onRefresh }: VehicleTableProps) {
  const { deleteVehicle, loadVehiclesFromDB } = useVehicleStore();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "خطا در حذف خودرو");
      }

      deleteVehicle(id);
      await loadVehiclesFromDB();
      toast({
        title: "موفق",
        description: "خودرو با موفقیت حذف شد",
      });
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
      onRefresh?.();
    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطا در حذف خودرو",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      handleDelete(vehicleToDelete);
    }
  };

  return (
    <>
      <div className="rounded-lg border border-border/30 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>لوگو</TableHead>
              <TableHead>نام</TableHead>
              <TableHead>مدل‌ها</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow key="empty-state">
                <TableCell colSpan={5} className="text-center py-8">
                  خودرویی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle, index) => (
                <TableRow key={vehicle.id || `vehicle-${index}`}>
                  <TableCell>
                    <VehicleLogo
                      logo={vehicle.logo}
                      alt={vehicle.name}
                      size="md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {vehicle.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {vehicle.models && vehicle.models.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {vehicle.models.slice(0, 3).map((model, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {model}
                          </Badge>
                        ))}
                        {vehicle.models.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{vehicle.models.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={vehicle.enabled ? "default" : "secondary"}>
                      {vehicle.enabled ? "فعال" : "غیرفعال"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/vehicles/${vehicle.id}`}>
                            <Edit className="ml-2 h-4 w-4" />
                            ویرایش
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setVehicleToDelete(vehicle.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف خودرو</DialogTitle>
            <DialogDescription>
              آیا از حذف این خودرو اطمینان دارید؟ این عمل قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              انصراف
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

