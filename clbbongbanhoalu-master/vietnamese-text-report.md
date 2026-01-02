# Vietnamese Linguistics Normalization Report

This report details the normalization of Vietnamese UI text across the repository, adhering to proper linguistic capitalization rules as a Vietnamese Linguistics Expert.

## 1. Normalization Rules Applied

### Rule 1: Common Nouns & Phrases (Sentence Case)
Applied to all general descriptions, headings, labels, and menu items.
- *Before:* "Trang Chủ", "Lịch Tập Luyện", "CỬA HÀNG"
- *After:* "Trang chủ", "Lịch tập luyện", "Cửa hàng"

### Rule 2: Proper Nouns (Proper Case)
Proper names of people, places, and organizations remain fully capitalized for each word.
- *Proper names detected:* Hoa Lư, Ninh Bình, Đông Thành, Lê Quý Đôn, Butterfly, Dignics, Mizuno, Thầy Hùng, Cô Lan.

### Rule 3: Mixed Phrases
Capitalization applied only to the proper noun component.
- *Examples:* "CLB bóng bàn Hoa Lư", "Nhà thi đấu Ninh Bình", "Về CLB bóng bàn Hoa Lư".

### Rule 4: Uppercase Mode
Reserved exclusively for primary Action Buttons and Banners.
- *Examples:* "THAM GIA NGAY", "XUẤT EXCEL", "LƯU GIAO DỊCH", "ĐĂNG KÝ HỘI VIÊN NGAY".

## 2. Summary of Changes by Component

| Component | Scope of Changes | Casing Mode |
|:---|:---|:---|
| **App.tsx** | Navigation menu, Footer links, Brand logo text | Sentence Case / Proper Case |
| **Home.tsx** | Intro section, Pricing cards, FAQ, Highlights | Sentence Case |
| **About.tsx** | Timeline, Achievements list, Vision section | Sentence Case |
| **Schedule.tsx** | Training headers, Regulation list | Sentence Case |
| **Shop.tsx** | Category filters, Banner headings, SEO description | Sentence Case |
| **Gallery.tsx** | Gallery header, Submission footer | Sentence Case |
| **Register.tsx** | Form labels, Goals list, Success messages | Sentence Case |
| **Admin.tsx** | Control panel labels, Modal prompts | Sentence Case |
| **constants.tsx** | Exported data for achievements and products | Sentence Case |
| **index.html** | SEO Title, Meta Description, Open Graph tags | Sentence Case |

## 3. Preservation Notice
- **Variable Names:** All code identifiers and database pointers remain untouched.
- **Acronyms:** Acronyms like CLB, HKPĐ, THCS, TP, VNĐ remain in uppercase as per standard practice.
- **Accents:** Meticulous care was taken to preserve all Vietnamese diacritics.

*Report compiled by Vietnamese Linguistics Expert System.*
