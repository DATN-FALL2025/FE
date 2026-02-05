import React from "react";

const LoanPage: React.FC = () => {
  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: 18, marginBottom: 12 }}>
        📌 Vay tiêu dùng cho NV văn phòng, Công nhân, Tài xế,...
      </h1>

      <ul style={{ listStyle: "none", padding: 0, marginBottom: 12 }}>
        <li>💸 <strong>Hạn mức 300tr</strong> – trả góp <strong>8.8tr/tháng</strong></li>
        <li>💸 <strong>Hạn mức 100tr</strong> – trả góp <strong>2.9tr/tháng</strong></li>
        <li>💸 <strong>Hạn mức 50tr</strong> – trả góp <strong>1.4tr/tháng</strong></li>
      </ul>

      <ul style={{ listStyle: "none", padding: 0, marginBottom: 12 }}>
        <li>✔️ Hồ sơ đơn giản: CCCD + sao kê lương 3 tháng</li>
        <li>🚀 Giải ngân nhanh trong 24h</li>
        <li>⚡ Hỗ trợ toàn quốc</li>
        <li>✅ Không thế chấp – thủ tục đơn giản</li>
      </ul>

      <p>
        📲 <strong>Liên hệ:</strong>{" "}
        <a href="tel:0565342913" style={{ color: "#2563eb", fontWeight: 600 }}>
          0565 342 913
        </a>{" "}
        để kiểm tra hồ sơ miễn phí
      </p>
    </main>
  );
};

export default LoanPage;
