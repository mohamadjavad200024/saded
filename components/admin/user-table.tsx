"use client";

import { useState } from "react";
import { User } from "@/types/user";
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
import { MoreHorizontal, User as UserIcon, Shield, Ban, CheckCircle } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";

interface UserTableProps {
  users: User[];
  onRefresh?: () => void;
}

const roleLabels: Record<User["role"], string> = {
  admin: "مدیر",
  user: "کاربر",
  moderator: "ناظر",
};

const statusLabels: Record<User["status"], string> = {
  active: "فعال",
  inactive: "غیرفعال",
  suspended: "معلق",
};

const roleColors: Record<User["role"], string> = {
  admin: "destructive",
  user: "default",
  moderator: "secondary",
};

const statusColors: Record<User["status"], string> = {
  active: "success",
  inactive: "secondary",
  suspended: "warning",
};

export function UserTable({ users, onRefresh }: UserTableProps) {
  const { updateUserStatus, updateUserRole, deleteUser } = useUserStore();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleStatusChange = (id: string, status: User["status"]) => {
    updateUserStatus(id, status);
    toast({
      title: "موفق",
      description: "وضعیت کاربر به‌روزرسانی شد",
    });
    onRefresh?.();
  };

  const handleRoleChange = (id: string, role: User["role"]) => {
    updateUserRole(id, role);
    toast({
      title: "موفق",
      description: "نقش کاربر به‌روزرسانی شد",
    });
    onRefresh?.();
  };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      toast({
        title: "موفق",
        description: "کاربر با موفقیت حذف شد",
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      onRefresh?.();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  return (
    <>
      <div className="rounded-lg border border-border/30 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>ایمیل</TableHead>
              <TableHead>تلفن</TableHead>
              <TableHead>نقش</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>سفارشات</TableHead>
              <TableHead>خرید کل</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  کاربری یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={roleColors[user.role] as any}>
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[user.status] as any}>
                      {statusLabels[user.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.ordersCount || 0}</TableCell>
                  <TableCell>
                    {user.totalSpent ? formatPrice(user.totalSpent) : "0"} تومان
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
                        <DropdownMenuLabel>تغییر نقش</DropdownMenuLabel>
                        {Object.entries(roleLabels).map(([role, label]) => (
                          <DropdownMenuItem
                            key={role}
                            onClick={() => handleRoleChange(user.id, role as User["role"])}
                            disabled={user.role === role}
                          >
                            <Shield className="ml-2 h-4 w-4" />
                            {label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>تغییر وضعیت</DropdownMenuLabel>
                        {Object.entries(statusLabels).map(([status, label]) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(user.id, status as User["status"])}
                            disabled={user.status === status}
                          >
                            {status === "active" ? (
                              <CheckCircle className="ml-2 h-4 w-4" />
                            ) : (
                              <Ban className="ml-2 h-4 w-4" />
                            )}
                            {label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(user.id)}
                        >
                          حذف کاربر
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
            <DialogTitle>حذف کاربر</DialogTitle>
            <DialogDescription>
              آیا از حذف این کاربر اطمینان دارید؟ این عمل قابل بازگشت نیست.
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


