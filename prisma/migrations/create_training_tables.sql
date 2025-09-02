-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('VIDEO', 'PDF');

-- CreateTable
CREATE TABLE "training_sections" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "training_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_resources" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "resource_type" "ResourceType" NOT NULL,
    "thumbnail_url" TEXT,
    "duration" VARCHAR(50),
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "training_resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "training_sections_parent_id_idx" ON "training_sections"("parent_id");
CREATE INDEX "training_sections_level_idx" ON "training_sections"("level");
CREATE INDEX "training_sections_is_active_idx" ON "training_sections"("is_active");
CREATE INDEX "training_sections_order_idx" ON "training_sections"("order");

-- CreateIndex
CREATE INDEX "training_resources_section_id_idx" ON "training_resources"("section_id");
CREATE INDEX "training_resources_resource_type_idx" ON "training_resources"("resource_type");
CREATE INDEX "training_resources_is_active_idx" ON "training_resources"("is_active");
CREATE INDEX "training_resources_order_idx" ON "training_resources"("order");

-- AddForeignKey
ALTER TABLE "training_sections" ADD CONSTRAINT "training_sections_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "training_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_resources" ADD CONSTRAINT "training_resources_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "training_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add constraint to limit section levels (max 3 sub-levels from root)
CREATE OR REPLACE FUNCTION check_section_level()
RETURNS TRIGGER AS $$
DECLARE
    parent_level INTEGER;
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.level := 0;
    ELSE
        SELECT level INTO parent_level FROM training_sections WHERE id = NEW.parent_id;
        IF parent_level >= 3 THEN
            RAISE EXCEPTION 'Maximum nesting level (3) exceeded';
        END IF;
        NEW.level := parent_level + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_section_level
    BEFORE INSERT OR UPDATE ON training_sections
    FOR EACH ROW
    EXECUTE FUNCTION check_section_level();