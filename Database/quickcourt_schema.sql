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
  total_amount numeric(10,2) NOT NULL,
  payment_id   uuid REFERENCES payments(id),
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  cancel_reason text
);

-- Payments
CREATE TABLE payments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id   uuid UNIQUE REFERENCES bookings(id),
  method       text,
  amount       numeric(10,2),
  currency     text DEFAULT 'INR',
  status       text,
  provider_txn_id text,
  created_at   timestamptz DEFAULT now()
);

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
