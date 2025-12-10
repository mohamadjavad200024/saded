import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Phone, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "تماس با ما - ساد",
  description: "راه‌های تماس با فروشگاه ساد",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">تماس با ما</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">تلفن</h3>
                  <p className="text-muted-foreground">021-12345678</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">ایمیل</h3>
                  <p className="text-muted-foreground">info@saded.ir</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">آدرس</h3>
                  <p className="text-muted-foreground">تهران، ایران</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

