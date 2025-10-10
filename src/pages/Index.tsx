import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Shield, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">منصة موحدة لدول الخليج</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              Gulf Unified Platform
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in">
              المنصة الخليجية الموحدة للخدمات الرقمية
            </p>
            
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
              احجز الشاليهات، أرسل الشحنات، وأدر خدماتك عبر جميع دول مجلس التعاون الخليجي من مكان واحد
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/services">
                <Button size="lg" className="text-lg px-8 py-6 shadow-glow">
                  <span className="ml-2">ابدأ الآن</span>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">سريع وآمن</h3>
              <p className="text-muted-foreground">
                معاملات فورية مع أعلى معايير الأمان والحماية
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">موثوق ومعتمد</h3>
              <p className="text-muted-foreground">
                جميع الخدمات معتمدة ومطابقة للمعايير المحلية
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-card rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card border border-border">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">سهل الاستخدام</h3>
              <p className="text-muted-foreground">
                واجهة بسيطة وسهلة تدعم جميع دول الخليج
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              جاهز للبدء؟
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              انضم إلى آلاف المستخدمين الذين يثقون بمنصتنا
            </p>
            <Link to="/services">
              <Button size="lg" className="text-lg px-8 py-6">
                <span className="ml-2">استكشف الخدمات</span>
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
