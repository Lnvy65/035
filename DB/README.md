## 🗄️ Database Schema (데이터베이스 구조)

### 기타내역
AI를 이용해 제작한 DB구조입니다.
수정이 필요할 경우 언제든지 수정바랍니다.

### 1. Users (사용자)
사용자 계정 정보를 관리하는 기본 테이블입니다.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `uid` | BIGINT | **PK**, AUTO_INCREMENT | 유저 고유 ID |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | 로그인 이메일 (아이디) |
| `password_hash` | VARCHAR(255) | NOT NULL | 암호화된 비밀번호 |
| `name` | VARCHAR(50) | NOT NULL | 사용자 이름 또는 닉네임 |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 가입 일자 |

<br>

### 2. Official_Services (공식 주요 서비스)
메인 홈페이지에 노출할 기준 구독 서비스 데이터입니다. (관리자 제어)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `service_id` | BIGINT | **PK**, AUTO_INCREMENT | 서비스 고유 ID |
| `service_name` | VARCHAR(100) | NOT NULL | 공식 서비스명 (예: 넷플릭스 프리미엄) |
| `category` | VARCHAR(50) | | 카테고리 (OTT, 음악 등) |
| `monthly_price` | INT | NOT NULL | 기준 월 결제 금액 |
| `logo_url` | VARCHAR(255) | | 로고 이미지 URL |
| `cancel_url` | VARCHAR(255) | | 공식 웹사이트 해지 다이렉트 링크 |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | 최근 요금 업데이트 일자 |

<br>

### 3. User_Subscriptions (개인 구독 내역)
사용자별 실제 구독 현황과 직접 추가한 커스텀 구독 데이터를 저장합니다.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_sub_id` | BIGINT | **PK**, AUTO_INCREMENT | 개별 구독 내역 고유 ID |
| `user_uid` | BIGINT | **FK**, NOT NULL | Users 테이블 참조 (ON DELETE CASCADE) |
| `service_name` | VARCHAR(100) | NOT NULL | 구독 중인 서비스명 (직접 입력 가능) |
| `monthly_price` | INT | NOT NULL | 실제 결제하는 월 금액 |
| `next_billing_date` | DATE | | 다음 결제 예정일 |
| `category` | VARCHAR(50) | | 카테고리 |
| `status` | VARCHAR(20) | DEFAULT 'ACTIVE' | 상태 (ACTIVE: 활성, CANCELED: 해지됨) |
| `cancel_url` | VARCHAR(255) | | 해지 링크 (개인 추가 항목은 NULL) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 구독 추가 일자 |