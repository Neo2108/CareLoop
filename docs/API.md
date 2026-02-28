# API Documentation

All API routes require staff authentication (session cookie) except where noted.

## POST /api/send-sms

Sends an SMS reminder to the patient for a given appointment.

**Auth:** Required (staff)

**Request body:**

```json
{
  "appointmentId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field          | Type   | Required | Description   |
| -------------- | ------ | -------- | ------------- |
| `appointmentId`| string | Yes      | UUID of the appointment |

**Success (200):**

```json
{
  "success": true,
  "messageSid": "SM123...",
  "link": "https://example.com/patients/appointment/550e8400-..."
}
```

**Errors:**

- `400` - Invalid or missing `appointmentId`, or appointment has no phone number
- `404` - Appointment not found
- `429` - Rate limited (when Upstash Redis is configured)
- `500` - Twilio error or server error

---

## POST /api/initiate-call

Initiates an outbound AI reminder call to a phone number.

**Auth:** Required (staff)

**Request body:**

```json
{
  "to_number": "+15551234567"
}
```

| Field      | Type   | Required | Description      |
| ---------- | ------ | -------- | ---------------- |
| `to_number`| string | Yes      | E.164 phone number |

**Success (200):** Returns ElevenLabs API response.

**Errors:**

- `400` - Missing or invalid `to_number`
- `429` - Rate limited (when Upstash Redis is configured)
- `500` - ElevenLabs API error or server error

---

## POST /api/trigger-reminder-calls

Triggers reminder calls for all of today's appointments that have not yet been called.

**Auth:** Required (staff)

**Request body:** None

**Success (200):**

```json
{
  "triggered": 3,
  "total": 5,
  "results": [
    { "appointmentId": "...", "success": true },
    { "appointmentId": "...", "success": false, "error": "..." }
  ]
}
```

**Errors:**

- `429` - Rate limited (when Upstash Redis is configured)
- `500` - ElevenLabs not configured or server error

---

## Error Response Format

All errors return a consistent shape:

```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE",
  "details": {}
}
```

`details` is optional and may contain validation errors or additional context.
