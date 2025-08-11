-- QuickCourt Booking Platform Schema
-- PostgreSQL version
-- Generated for Hackathon usage

-- Enum for user roles
CREATE TYPE user_role AS ENUM ('user', 'owner', 'admin');

-- Users table (merged profile info)
CREATE TABLE users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email          text NOT NULL UNIQUE,
  password_hash  text NOT NULL,
  role           user_role NOT NULL,
  is_active      boolean DEFAULT true,
  otp_verified   boolean DEFAULT false,
  avatar_url     text,
  full_name      text,
  phone          text,
  short_bio      text,
  credit_balance int NOT NULL DEFAULT 0,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- Venues
CREATE TABLE venues (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid REFERENCES users(id) ON DELETE SET NULL,
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text,
  address       text,
  city          text,
  latitude      double precision,
  longitude     double precision,
  starting_price numeric(10,2),
  rating_avg    numeric(3,2) DEFAULT 0,
  status        text NOT NULL DEFAULT 'pending',
  approved_by   uuid REFERENCES users(id),
  approved_at   timestamptz,
  refund_ratio_default numeric(5,2) DEFAULT 0.50 CHECK (refund_ratio_default >= 0 AND refund_ratio_default <= 1),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Venue photos
CREATE TABLE venue_photos (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id  uuid REFERENCES venues(id) ON DELETE CASCADE,
  url       text NOT NULL,
  caption   text,
  is_cover  boolean DEFAULT false,
  sort_idx  int DEFAULT 0
);

-- Amenities
CREATE TABLE amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE
);

CREATE TABLE venue_amenities (
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
  amenity_id uuid REFERENCES amenities(id),
  PRIMARY KEY (venue_id, amenity_id)
);

-- Courts
CREATE TABLE courts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id    uuid NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name        text NOT NULL,
  sport_type  text NOT NULL,
  price_per_hour numeric(10,2) NOT NULL,
  price_per_person numeric(10,2),
  allow_per_hour boolean DEFAULT true,
  allow_per_person boolean DEFAULT false,
  refund_ratio_override numeric(5,2) CHECK (refund_ratio_override >= 0 AND refund_ratio_override <= 1),
  capacity     int DEFAULT 1,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  is_active    boolean DEFAULT true
);

-- Court schedules
CREATE TABLE court_schedules (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id      uuid REFERENCES courts(id) ON DELETE CASCADE,
  weekday       smallint NOT NULL,
  start_time    time NOT NULL,
  end_time      time NOT NULL,
  slot_interval_minutes smallint NOT NULL DEFAULT 60,
  price_multiplier numeric(5,2) DEFAULT 1.0,
  created_at    timestamptz DEFAULT now()
);

-- Court slots
CREATE TABLE court_slots (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id     uuid NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  start_at     timestamptz NOT NULL,
  end_at       timestamptz NOT NULL,
  base_price   numeric(10,2) NOT NULL,
  is_blocked   boolean DEFAULT false,
  slot_status  text DEFAULT 'available',
  created_at   timestamptz DEFAULT now(),
  UNIQUE(court_id, start_at, end_at)
);

-- Blocked slots
CREATE TABLE blocked_slots (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id  uuid REFERENCES courts(id) ON DELETE CASCADE,
  start_at  timestamptz NOT NULL,
  end_at    timestamptz NOT NULL,
  reason    text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Bookings
CREATE TABLE bookings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref  text NOT NULL UNIQUE,
  user_id      uuid NOT NULL REFERENCES users(id),
  court_id     uuid NOT NULL REFERENCES courts(id),
  venue_id     uuid NOT NULL REFERENCES venues(id),
  start_at     timestamptz NOT NULL,
  end_at       timestamptz NOT NULL,
  time_range   tstzrange GENERATED ALWAYS AS (tstzrange(start_at, end_at, '[]')) STORED,
  status       text NOT NULL DEFAULT 'confirmed',
  pricing_mode text NOT NULL DEFAULT 'per_hour' CHECK (pricing_mode IN ('per_hour','per_person')),
  unit_price   numeric(10,2) NOT NULL DEFAULT 0,
  effective_refund_ratio numeric(5,2) CHECK (effective_refund_ratio >= 0 AND effective_refund_ratio <= 1),
  total_amount numeric(10,2) NOT NULL,
  payment_id   uuid REFERENCES payments(id),
  -- community fields
  visibility   text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','public','invite_only')),
  player_capacity smallint,
  allow_auto_join boolean DEFAULT true,
  join_code     text UNIQUE,
  host_notes    text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  cancel_reason text
);

CREATE INDEX IF NOT EXISTS idx_bookings_visibility ON bookings(visibility);

-- Payments
CREATE TABLE payments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id   uuid UNIQUE REFERENCES bookings(id),
  method       text,
  amount       numeric(10,2),
  amount_cash  numeric(10,2) DEFAULT 0,
  credits_used int DEFAULT 0,
  currency     text DEFAULT 'INR',
  status       text,
  provider_txn_id text,
  created_at   timestamptz DEFAULT now()
);

-- Credit transactions ledger
CREATE TABLE credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  amount int NOT NULL, -- positive earn, negative spend
  type text NOT NULL CHECK (type IN ('earn','spend','refund','adjust')),
  reason text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_credit_tx_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_tx_booking ON credit_transactions(booking_id);

-- Reviews
CREATE TABLE reviews (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id  uuid REFERENCES venues(id) ON DELETE CASCADE,
  user_id   uuid REFERENCES users(id),
  rating    smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title     text,
  body      text,
  created_at timestamptz DEFAULT now()
);

-- Facility applications
CREATE TABLE facility_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users(id),
  venue_id uuid REFERENCES venues(id),
  status text DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  decided_by uuid REFERENCES users(id),
  decided_at timestamptz,
  decision_notes text
);

-- Audit logs
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES users(id),
  object_type text,
  object_id uuid,
  action text,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text,
  payload jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Booking participants (host + players)
CREATE TABLE booking_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'player' CHECK (role IN ('host','player')),
  status text NOT NULL DEFAULT 'joined' CHECK (status IN ('joined','requested','invited','rejected','cancelled')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE (booking_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_booking_participants_booking ON booking_participants(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_participants_user ON booking_participants(user_id);
