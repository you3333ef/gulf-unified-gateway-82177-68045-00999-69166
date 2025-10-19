import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLink } from "@/hooks/useSupabase";
import { getCountryByCode } from "@/lib/countries";
import { getServicesByCountry } from "@/lib/gccShippingServices";
import { Package, MapPin, DollarSign, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateShippingLink = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createLink = useCreateLink();
  const countryData = getCountryByCode(country || "");
  const services = getServicesByCountry(country || "");
  
  const [selectedService, setSelectedService] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderCity, setSenderCity] = useState("");
  const [codAmount, setCodAmount] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !trackingNumber) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const link = await createLink.mutateAsync({
        type: "shipping",
        country_code: country || "",
        payload: {
          service_name: selectedService,
          tracking_number: trackingNumber,
          sender_name: senderName,
          sender_city: senderCity,
          cod_amount: parseFloat(codAmount) || 0,
        },
      });
      
      // Navigate to payment page with service parameter
      navigate(`/pay/${link.id}/details?service=${selectedService}`);
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };
  
  if (!countryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">الدولة غير موجودة</h2>
          <p className="text-muted-foreground">الرجاء اختيار دولة صحيحة</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-elevated">
            <div
              className="h-24 -m-8 mb-6 rounded-t-xl relative"
              style={{
                background: `linear-gradient(135deg, ${countryData.primaryColor}, ${countryData.secondaryColor})`,
              }}
            >
              <div className="absolute inset-0 bg-black/20 rounded-t-xl" />
              <div className="absolute bottom-4 right-6 text-white">
                <h1 className="text-2xl font-bold">إنشاء رابط دفع - شحن</h1>
                <p className="text-sm opacity-90">{countryData.nameAr}</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div>
                <Label className="mb-2">خدمة الشحن *</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="اختر خدمة الشحن" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.key}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Tracking Number */}
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  رقم الشحنة *
                </Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="مثال: 1234567890"
                  className="h-12"
                  required
                />
              </div>
              
              {/* Sender Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">اسم المرسل</Label>
                  <Input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="الاسم"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    مدينة المرسل
                  </Label>
                  <Input
                    value={senderCity}
                    onChange={(e) => setSenderCity(e.target.value)}
                    placeholder="المدينة"
                    className="h-12"
                  />
                </div>
              </div>
              
              
              {/* COD Amount */}
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  مبلغ الدفع عند الاستلام
                </Label>
                <Input
                  type="number"
                  value={codAmount}
                  onChange={(e) => setCodAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-12"
                  step="0.01"
                  min="0"
                />
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg py-7"
                disabled={createLink.isPending}
              >
                {createLink.isPending ? (
                  <span>جاري الإنشاء...</span>
                ) : (
                  <>
                    <Package className="w-5 h-5 ml-2" />
                    <span>إنشاء رابط الدفع</span>
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateShippingLink;
