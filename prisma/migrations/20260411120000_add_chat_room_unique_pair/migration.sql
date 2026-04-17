WITH ranked_rooms AS (
    SELECT
        id,
        "clientId",
        "expertId",
        ROW_NUMBER() OVER (
            PARTITION BY "clientId", "expertId"
            ORDER BY "updatedAt" DESC, "createdAt" DESC, id DESC
        ) AS row_num,
        FIRST_VALUE(id) OVER (
            PARTITION BY "clientId", "expertId"
            ORDER BY "updatedAt" DESC, "createdAt" DESC, id DESC
        ) AS keeper_id
    FROM "chat_rooms"
),
duplicate_rooms AS (
    SELECT id, keeper_id
    FROM ranked_rooms
    WHERE row_num > 1
)
UPDATE "messages" AS m
SET "roomId" = d.keeper_id
FROM duplicate_rooms AS d
WHERE m."roomId" = d.id;

WITH ranked_rooms AS (
    SELECT
        id,
        "clientId",
        "expertId",
        ROW_NUMBER() OVER (
            PARTITION BY "clientId", "expertId"
            ORDER BY "updatedAt" DESC, "createdAt" DESC, id DESC
        ) AS row_num,
        FIRST_VALUE(id) OVER (
            PARTITION BY "clientId", "expertId"
            ORDER BY "updatedAt" DESC, "createdAt" DESC, id DESC
        ) AS keeper_id
    FROM "chat_rooms"
),
duplicate_rooms AS (
    SELECT id, keeper_id
    FROM ranked_rooms
    WHERE row_num > 1
)
UPDATE "calls" AS c
SET "roomId" = d.keeper_id
FROM duplicate_rooms AS d
WHERE c."roomId" = d.id;

WITH ranked_rooms AS (
    SELECT
        id,
        ROW_NUMBER() OVER (
            PARTITION BY "clientId", "expertId"
            ORDER BY "updatedAt" DESC, "createdAt" DESC, id DESC
        ) AS row_num
    FROM "chat_rooms"
)
DELETE FROM "chat_rooms"
WHERE id IN (
    SELECT id
    FROM ranked_rooms
    WHERE row_num > 1
);

CREATE UNIQUE INDEX "chat_rooms_clientId_expertId_key" ON "chat_rooms"("clientId", "expertId");
