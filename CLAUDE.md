# AstroFit Studio – hướng dẫn sửa app

Trang chạy thật (GitHub Pages) là `index.html`, `sw.js`, `manifest.webmanifest`, `icons/` ở gốc repo — đều được SINH RA từ `src/`. Không sửa tay các file đó.

## Sửa và phát hành
1. Sửa mã nguồn trong `src/` (giao diện: `shell.html`; logic + văn bản phân tích: `app.js`; kho nội dung cung/hành tinh: `kb.js`; tính thiên văn: `engine.js`).
2. Build: `python3 src/build.py "Bản NN · dd/mm/yyyy"` (tăng số bản mỗi lần phát hành; nhãn hiện ở cuối trang).
3. QC bắt buộc trước khi push (cần `npm i jsdom playwright` trong `src/qc`):
   - `node src/qc/qc2.js index.html` ở vài múi giờ (`TZ=UTC`, `TZ=Asia/Ho_Chi_Minh`) → không lỗi, điểm khớp `src/qc/baseline_scores.json` (trừ khi người dùng yêu cầu đổi cách chấm), mọi múi giờ cho cùng một uiHash.
   - Các script QC mở trang với `#demo` để nạp 4 người mẫu cố định (người dùng thật luôn thấy ô nhập trống khi mở lần đầu).
   - `qcblank.js` (mở lần đầu: ô trống, tự vào tab Nhập thông tin, nhập rồi ra kết quả; chạy `python3 -m http.server 8766` ở gốc repo trước).
   - `qcfuture.js` (nhập nhầm năm sinh: hiện cảnh báo; năm ở tương lai thì không chấm).
   - `qcgroup.js` (chạm vào từng tên trong bảng nhóm/chú thích biểu đồ → mở đúng phân tích chi tiết của người đó với người chính).
   - Khi đổi phần giả lập giờ sinh: `node src/qc/qccalib.js A|B|C|D N` (A một người không rõ giờ, B cả hai, C khoảng 'Sáng', D biết cung mọc) → độ phủ khoảng giả lập ~80%, sai lệch TB thấp hơn cách lấy 12h. Kết quả bản 17: A 84%, B 82%, C 82%, D 81,5% (đã so mật độ 12–15 / ~19 / ~23 mốc khi biết cung mọc: ~19 mốc tốt nhất, giữ SIM_ASC_N=24). `qcreal.js`: thử trên 4 người thật trong mẫu.
   - `qcsummary.js` (nút "Sao chép tóm tắt" có đủ ngày, giờ, nơi sinh của từng người để tái lập kết quả).
   - `qcdate.js` (ô ngày sinh dạng ngày/tháng/năm: tự thêm dấu /, gõ 11/6/2002 được, ngày sai bị báo, nút lịch đồng bộ).
   - `qc3.js` (nhóm người), `qcnlp.js` (ô nhập bằng lời), `qcsim.js` (giả lập giờ sinh), `qcplain.js` (không lộ thuật ngữ chuyên môn), `qcpwa.js` (cài được, chạy offline, không tràn ngang trên điện thoại; chạy `python3 -m http.server 8765` ở gốc repo trước).
4. Commit `src/` và các file sinh ra, push lên `main`. Pages tự cập nhật sau ~1 phút; app trên điện thoại hiện "Đã có bản mới · Tải lại".

## Quy ước
- Văn phong: tiếng Việt tự nhiên, dễ hiểu cho người không biết chiêm tinh, không lặp ý, không viết kiểu liệt kê máy móc.
- Kết quả phải giống hệt nhau mỗi lần xem (không dùng ngẫu nhiên/thời gian thực trong chấm điểm).
- Giữ dòng "Người tạo: Hoàng Trung Đức" ở cuối trang.
- Link app: https://godkinggamer.github.io/Astrofit/ (chữ A viết hoa).
