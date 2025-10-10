import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountryByCode, formatCurrency } from "@/lib/countries";
import { useChalets, useCreateLink } from "@/hooks/useSupabase";
import { ArrowRight, Home, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateChaletLink = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const countryData = getCountryByCode(country || "");
  
  const { data: chalets, isLoading } = useChalets(country);
  const createLink = useCreateLink();
  
  const [selectedChaletId, setSelectedChaletId] = useState<string>("");
  const [pricePerNight, setPricePerNight] = useState<number>(0);
  const [nights, setNights] = useState<number>(1);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const selectedChalet = chalets?.find((c) => c.id === selectedChaletId);
  const totalAmount = pricePerNight * nights;
  
  useEffect(() => {
    if (selectedChalet) {
      setPricePerNight(selectedChalet.default_price);
    }
  }, [selectedChalet]);
  
  const handleCreate = async () => {
    if (!selectedChalet || !countryData) return;
    
    const payload = {
      chalet_id: selectedChalet.id,
      chalet_name: selectedChalet.name,
      price_per_night: pricePerNight,
      nights,
      guest_count: guestCount,
      total_amount: totalAmount,
      currency: countryData.currency,
    };
    
    try {
      const link = await createLink.mutateAsync({
        type: "chalet",
        country_code: country!,
        provider_id: selectedChalet.provider_id || undefined,
        payload,
      });
      
      setCreatedLink(link.microsite_url);
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };
  
  const handleCopy = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "تم النسخ!",
        description: "تم نسخ الرابط إلى الحافظة",
      });
    }
  };
  
  if (!countryData) {
    return <div className="p-8 text-center">دولة غير صحيحة</div>;
  }
  
  if (createdLink) {
    return (
      <div className="min-h-screen py-12" dir="rtl">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">تم إنشاء الرابط بنجاح!</h2>
            <p className="text-muted-foreground mb-8">
              شارك هذا الرابط مع عملائك
            </p>
            
            <div className="bg-secondary/50 p-4 rounded-lg mb-6 break-all">
              <code className="text-sm">{createdLink}</code>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={handleCopy} size="lg">
                {copied ? (
                  <>
                    <Check className="w-5 h-5 ml-2" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 ml-2" />
                    <span>نسخ الرابط</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open(createdLink, "_blank")}
              >
                <span className="ml-2">عرض المعاينة</span>
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </div>
            
            <Button
              variant="ghost"
              className="mt-8"
              onClick={() => navigate("/services")}
            >
              إنشاء رابط جديد
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${countryData.primaryColor}, ${countryData.secondaryColor})`,
                }}
              >
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">حجز شاليه - {countryData.nameAr}</h1>
                <p className="text-muted-foreground">أنشئ رابط حجز مخصص</p>
              </div>
            </div>
          </div>
          
          <Card className="p-8">
            <div className="space-y-6">
              {/* Chalet Selection */}
              <div>
                <Label className="text-lg mb-2">اختر الشاليه</Label>
                <Select onValueChange={setSelectedChaletId} disabled={isLoading}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder={isLoading ? "جاري التحميل..." : "اختر شاليه..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {chalets?.map((chalet) => (
                      <SelectItem key={chalet.id} value={chalet.id}>
                        <div className="flex items-center gap-2">
                          <span>{chalet.name}</span>
                          {chalet.verified && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              موثّق
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedChalet && (
                <>
                  {/* Chalet Details */}
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>المدينة:</strong> {selectedChalet.city}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>العنوان:</strong> {selectedChalet.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>السعة:</strong> حتى {selectedChalet.capacity} ضيف
                    </p>
                  </div>
                  
                  {/* Price per Night */}
                  <div>
                    <Label className="text-lg mb-2">
                      سعر الليلة ({countryData.currency})
                    </Label>
                    <Input
                      type="number"
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(Number(e.target.value))}
                      className="h-12 text-lg"
                    />
                  </div>
                  
                  {/* Number of Nights */}
                  <div>
                    <Label className="text-lg mb-2">عدد الليالي</Label>
                    <Input
                      type="number"
                      min="1"
                      value={nights}
                      onChange={(e) => setNights(Number(e.target.value))}
                      className="h-12 text-lg"
                    />
                  </div>
                  
                  {/* Guest Count */}
                  <div>
                    <Label className="text-lg mb-2">عدد الضيوف</Label>
                    <Input
                      type="number"
                      min="1"
                      max={selectedChalet.capacity}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="h-12 text-lg"
                    />
                  </div>
                  
                  {/* Total Amount */}
                  <div className="bg-gradient-primary p-6 rounded-xl text-primary-foreground">
                    <p className="text-sm mb-2">المبلغ الإجمالي</p>
                    <p className="text-4xl font-bold">
                      {formatCurrency(totalAmount, countryData.currency)}
                    </p>
                    <p className="text-sm mt-2 opacity-80">
                      {pricePerNight} × {nights} ليلة
                    </p>
                  </div>
                  
                  {/* Create Button */}
                  <Button
                    onClick={handleCreate}
                    disabled={createLink.isPending}
                    size="lg"
                    className="w-full text-lg py-6"
                  >
                    {createLink.isPending ? (
                      <span>جاري الإنشاء...</span>
                    ) : (
                      <>
                        <span className="ml-2">إنشاء رابط الحجز</span>
                        <ArrowRight className="w-5 h-5 mr-2" />
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateChaletLink;
