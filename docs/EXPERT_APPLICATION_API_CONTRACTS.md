# Expert Application API Contracts

Base URL prefix: `/api/v1`

## 1) Submit Expert Application

- Method: `POST`
- Path: `/experts/apply`
- Auth: `CLIENT` (or authenticated user allowed by backend auth middleware)
- Content-Type: `multipart/form-data`

### Form fields

- `fullName` (string, required)
- `email` (string, required)
- `phone` (string, optional)
- `bio` (string, optional)
- `title` (string, optional)
- `experience` (number as string, required, non-negative integer)
- `consultationFee` (number as string, required, positive integer)
- `industryId` (uuid string, required)
- `profilePhoto` (string URL, optional)
- `resume` (file, required)

### Resume file constraints

- Allowed MIME types: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Recommended max file size: keep under your server upload limit.

### Success response

```json
{
  "success": true,
  "message": "Expert application submitted successfully",
  "data": {
    "id": "application-uuid",
    "status": "PENDING",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "resumeUrl": "https://...",
    "createdAt": "2026-05-02T10:00:00.000Z"
  }
}
```

### Common errors

- `400`: missing required fields, invalid numbers, no resume, existing pending application
- `401`: user not active/authenticated
- `404`: industry not found

## 2) My Applications

- Method: `GET`
- Path: `/expert-verification/applications/me`
- Auth: `CLIENT`, `EXPERT`, or `ADMIN`

### Success response

```json
{
  "success": true,
  "message": "My expert applications fetched successfully",
  "data": [
    {
      "id": "application-uuid",
      "status": "PENDING",
      "fullName": "Jane Doe",
      "industry": {
        "id": "industry-uuid",
        "name": "Software"
      },
      "createdAt": "2026-05-02T10:00:00.000Z"
    }
  ]
}
```

## 3) Admin List Applications (Pagination + Filters)

- Method: `GET`
- Path: `/expert-verification/applications`
- Auth: `ADMIN`

### Query params

- `page` (number, optional, default `1`)
- `limit` (number, optional, default `10`, max `100`)
- `searchTerm` (string, optional)
- `status` (`PENDING | APPROVED | REJECTED`, optional)
- `industryId` (uuid, optional)
- `reviewedBy` (string, optional)
- `sortBy` (`createdAt | updatedAt | reviewedAt | fullName`, optional, default `createdAt`)
- `sortOrder` (`asc | desc`, optional, default `desc`)

### Example

`GET /api/v1/expert-verification/applications?page=1&limit=20&status=PENDING&searchTerm=jane&sortBy=createdAt&sortOrder=desc`

### Success response

```json
{
  "success": true,
  "message": "Expert applications fetched successfully",
  "data": [
    {
      "id": "application-uuid",
      "status": "PENDING",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "user": {
        "id": "user-uuid",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "industry": {
        "id": "industry-uuid",
        "name": "Software"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 53,
    "totalPages": 3
  }
}
```

## 4) Admin Get Single Application

- Method: `GET`
- Path: `/expert-verification/applications/:id`
- Auth: `ADMIN`

## 5) Admin Open or Download Resume (Secure)

- Method: `GET`
- Path: `/expert-verification/applications/:id/resume`
- Auth: `ADMIN`

### Query params

- `download=true|false` (optional)
- If `download=true`, backend sends `Content-Disposition: attachment`
- If missing or `false`, backend sends `Content-Disposition: inline`

### Frontend usage

- Open in new tab (inline):
  - `window.open('/api/v1/expert-verification/applications/{id}/resume', '_blank')`
- Force browser download:
  - Use URL with `?download=true`

## 6) Admin Review Application

- Method: `PATCH`
- Path: `/expert-verification/applications/:id/review`
- Auth: `ADMIN`
- Body:

```json
{
  "status": "APPROVED",
  "notes": "Looks good"
}
```

`status` supports only `APPROVED` and `REJECTED`.

### Review side effects

- On `APPROVED`:
  - Expert profile is created/updated
  - verification state is set to approved
  - user role becomes `EXPERT`
  - in-app notification sent
  - decision email sent
- On `REJECTED`:
  - application marked rejected
  - in-app notification sent
  - decision email sent

### Common errors

- `400`: already reviewed
- `404`: application not found

## Frontend Implementation Checklist

1. Use `multipart/form-data` for `/experts/apply`; append `resume` as file.
2. Always refresh list after review action to avoid stale status.
3. For admin table, read pagination from `meta` and render page controls from `totalPages`.
4. Use debounced `searchTerm` (300-500ms) to reduce API calls.
5. For resume button, use inline open first; keep a separate download button using `download=true`.
6. Handle `400/404` with API message in toast.
7. Keep status enum constants in frontend to avoid typo bugs (`PENDING`, `APPROVED`, `REJECTED`).
