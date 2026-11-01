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
   - `qc3.js` (nhóm người), `qcnlp.js` (ô nhập bằng lời), `qcsim.js` (giả lập giờ sinh), `qcplain.js` (không lộ thuật ngữ chuyên môn), `qcpwa.js` (cài được, chạy offline, không tràn ngang trên điện thoại; chạy `python3 -m http.server 8765` ở gốc repo trước).
4. Commit `src/` và các file sinh ra, push lên `main`. Pages tự cập nhật sau ~1 phút; app trên điện thoại hiện "Đã có bản mới · Tải lại".

## Quy ước
- Văn phong: tiếng Việt tự nhiên, dễ hiểu cho người không biết chiêm tinh, không lặp ý, không viết kiểu liệt kê máy móc.
- Kết quả phải giống hệt nhau mỗi lần xem (không dùng ngẫu nhiên/thời gian thực trong chấm điểm).
- Giữ dòng "Người tạo: Hoàng Trung Đức" ở cuối trang.
- Link app: https://godkinggamer.github.io/Astrofit/ (chữ A viết hoa).
