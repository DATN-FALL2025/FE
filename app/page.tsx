"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  FileCheck,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Upload,
  Search,
  Bell,
  Plane,
  Users,
  BarChart3,
} from "lucide-react";
import { getDecodedToken, getRoleRedirectPath } from "@/lib/auth-utils";

export default function LandingPage() {
  const router = useRouter();

  // Check if user is already logged in and redirect to their dashboard
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      const decodedToken = getDecodedToken();
      if (decodedToken?.role) {
        const redirectPath = getRoleRedirectPath(decodedToken.role);
        console.log('🔀 User already logged in, redirecting to:', redirectPath);
        router.push(redirectPath);
      }
    }
  }, [router]);
  const features = [
    {
      icon: Upload,
      title: "Tải Tài Liệu Dễ Dàng",
      description: "Kéo thả tài liệu nhập học với tự động kiểm tra định dạng và quét virus.",
      color: "bg-blue-500",
    },
    {
      icon: Zap,
      title: "Xác Thực Tự Động",
      description: "Hệ thống thông minh tự động kiểm tra định dạng, kích thước và yêu cầu trước khi nộp.",
      color: "bg-yellow-500",
    },
    {
      icon: Clock,
      title: "Theo Dõi Thời Gian Thực",
      description: "Giám sát trạng thái tài liệu với cập nhật trực tiếp và nhắc nhở hạn chót.",
      color: "bg-green-500",
    },
    {
      icon: Shield,
      title: "Bảo Mật & Tuân Thủ",
      description: "Bảo mật cấp ngân hàng với lưu trữ mã hóa và theo dõi đầy đủ.",
      color: "bg-purple-500",
    },
    {
      icon: Bell,
      title: "Thông Báo Thông Minh",
      description: "Nhận cảnh báo tức thì cho phê duyệt, từ chối và hạn chót sắp đến.",
      color: "bg-orange-500",
    },
    {
      icon: BarChart3,
      title: "Bảng Điều Khiển Tiến Độ",
      description: "Phân tích trực quan hiển thị tiến độ nộp và tỷ lệ hoàn thành của bạn.",
      color: "bg-pink-500",
    },
  ];

  const programs = [
    {
      icon: Plane,
      title: "Đào Tạo Phi Công",
      description: "Chương trình chứng chỉ phi công chuyên nghiệp với đào tạo bay toàn diện.",
      badge: "Phổ Biến Nhất",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: Users,
      title: "Tiếp Viên Hàng Không",
      description: "Đào tạo tiếp viên hàng không ưu tú với dịch vụ khách hàng xuất sắc.",
      badge: "Mới",
      color: "from-purple-500 to-purple-700",
    },
    {
      icon: GraduationCap,
      title: "Bảo Trì Hàng Không",
      description: "Chuyên môn kỹ thuật về bảo trì máy bay và hệ thống kỹ thuật.",
      badge: "Nhu Cầu Cao",
      color: "from-orange-500 to-orange-700",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Tạo Tài Khoản",
      description: "Đăng ký với email và thông tin sinh viên để truy cập cổng thông tin.",
    },
    {
      step: "02",
      title: "Xem Yêu Cầu",
      description: "Kiểm tra yêu cầu tài liệu và hướng dẫn nộp của chương trình.",
    },
    {
      step: "03",
      title: "Tải Lên Tài Liệu",
      description: "Nộp tài liệu với giao diện kéo thả dễ dàng của chúng tôi.",
    },
    {
      step: "04",
      title: "Theo Dõi Tiến Độ",
      description: "Giám sát trạng thái xét duyệt và nhận thông báo về mọi cập nhật.",
    },
  ];

  const stats = [
    { value: "5,000+", label: "Sinh Viên Đã Đăng Ký" },
    { value: "98%", label: "Tỷ Lệ Phê Duyệt" },
    { value: "24 giờ", label: "Thời Gian Xét Duyệt TB" },
    { value: "100%", label: "Nền Tảng Bảo Mật" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">IDMAWA</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Học Viện Hàng Không</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block">
              Giới Thiệu
            </Link>
            <Link href="/programs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block">
              Chương Trình
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block">
              Liên Hệ
            </Link>
            <Button variant="outline" asChild>
              <Link href="/login">Đăng Nhập</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Bắt Đầu
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              ✈️ Cổng Thông Tin Tuyển Sinh Học Viện Hàng Không
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Đơn Giản Hóa Quy Trình Tuyển Sinh Học Viện Hàng Không
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Tải lên, theo dõi và quản lý hồ sơ tuyển sinh của bạn một cách dễ dàng. Quy trình tự động của chúng tôi đảm bảo xử lý hồ sơ nhanh chóng, an toàn và hiệu quả.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="text-lg h-12 px-8" asChild>
                <Link href="/signup">
                  Bắt Đầu Đăng Ký
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-12 px-8" asChild>
                <Link href="#how-it-works">
                  Tìm Hiểu Thêm
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Tính Năng</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mọi Thứ Bạn Cần Cho Tuyển Sinh Thuận Lợi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nền tảng của chúng tôi kết hợp tự động hóa, bảo mật và thiết kế thân thiện để đơn giản hóa quy trình nộp hồ sơ của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Quy Trình</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cách Thức Hoạt Động
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bắt đầu với quy trình 4 bước đơn giản để hoàn thành tuyển sinh của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                      <span className="text-2xl font-bold text-primary">{item.step}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-20 w-full h-0.5 bg-primary/20" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Chương Trình</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Chương Trình Đào Tạo Hàng Không
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lựa chọn từ các chương trình hàng không đẳng cấp thế giới được thiết kế để chuẩn bị cho bạn một sự nghiệp thành công.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <Card key={index} className="border-0 shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${program.color} p-8 text-white relative`}>
                    <Badge className="absolute top-4 right-4 bg-white text-primary border-0 font-semibold">
                      {program.badge}
                    </Badge>
                    <Icon className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold">{program.title}</h3>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-6 leading-relaxed">{program.description}</p>
                    <Button variant="outline" className="w-full group hover:bg-primary hover:text-white transition-colors">
                      Tìm Hiểu Thêm
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="bg-gradient-to-r from-primary to-primary/80 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10" />
            <CardContent className="p-12 md:p-16 text-center text-white relative">
              <div className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold">
                  Sẵn Sàng Bắt Đầu Sự Nghiệp Hàng Không?
                </h2>
                <p className="text-lg md:text-xl text-white/90">
                  Tham gia cùng hàng nghìn sinh viên đã hoàn thành thành công quy trình tuyển sinh với IDMAWA.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button size="lg" variant="secondary" className="text-lg h-12 px-8" asChild>
                    <Link href="/signup">
                      Đăng Ký Ngay
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg h-12 px-8 bg-transparent text-white border-white hover:bg-white/10" asChild>
                    <Link href="/contact">
                      Liên Hệ Chúng Tôi
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary rounded-lg p-2">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">IDMAWA</h1>
                  <p className="text-xs text-muted-foreground">Học Viện Hàng Không</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Đơn giản hóa tuyển sinh học viện hàng không với công nghệ hiện đại.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Liên Kết Nhanh</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">Giới Thiệu</Link></li>
                <li><Link href="/programs" className="hover:text-primary transition-colors">Chương Trình</Link></li>
                <li><Link href="/admissions" className="hover:text-primary transition-colors">Tuyển Sinh</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">Câu Hỏi Thường Gặp</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Hỗ Trợ</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary transition-colors">Trung Tâm Trợ Giúp</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Liên Hệ</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Chính Sách Bảo Mật</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Điều Khoản Dịch Vụ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Liên Hệ</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@idmawa.edu.vn</li>
                <li>Điện thoại: +84 123 456 789</li>
                <li>Giờ làm việc: 8AM - 5PM (Thứ 2 - Thứ 6)</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 IDMAWA - Học Viện Hàng Không. Bảo lưu mọi quyền.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">Bảo Mật</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Điều Khoản</Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
