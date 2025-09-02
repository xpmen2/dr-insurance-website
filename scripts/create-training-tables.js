const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTrainingTables() {
  try {
    console.log('Creating training system tables...');
    
    // Create ResourceType enum if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "ResourceType" AS ENUM ('VIDEO', 'PDF');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✓ ResourceType enum created or already exists');

    // Create training_sections table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS training_sections (
        id SERIAL PRIMARY KEY,
        parent_id INTEGER,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        level INTEGER NOT NULL DEFAULT 0,
        "order" INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ training_sections table created');

    // Add foreign key constraint
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE training_sections 
        ADD CONSTRAINT training_sections_parent_id_fkey 
        FOREIGN KEY (parent_id) REFERENCES training_sections(id) ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✓ Foreign key constraint added');

    // Create training_resources table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS training_resources (
        id SERIAL PRIMARY KEY,
        section_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        resource_type "ResourceType" NOT NULL,
        thumbnail_url TEXT,
        duration VARCHAR(50),
        "order" INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (section_id) REFERENCES training_sections(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ training_resources table created');

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS training_sections_parent_id_idx ON training_sections(parent_id)',
      'CREATE INDEX IF NOT EXISTS training_sections_level_idx ON training_sections(level)',
      'CREATE INDEX IF NOT EXISTS training_sections_is_active_idx ON training_sections(is_active)',
      'CREATE INDEX IF NOT EXISTS training_sections_order_idx ON training_sections("order")',
      'CREATE INDEX IF NOT EXISTS training_resources_section_id_idx ON training_resources(section_id)',
      'CREATE INDEX IF NOT EXISTS training_resources_resource_type_idx ON training_resources(resource_type)',
      'CREATE INDEX IF NOT EXISTS training_resources_is_active_idx ON training_resources(is_active)',
      'CREATE INDEX IF NOT EXISTS training_resources_order_idx ON training_resources("order")'
    ];

    for (const index of indexes) {
      await prisma.$executeRawUnsafe(index);
    }
    console.log('✓ All indexes created');

    // Create trigger function for level validation
    await prisma.$executeRawUnsafe(`
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
    `);
    console.log('✓ Level check function created');

    // Create trigger
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TRIGGER enforce_section_level
          BEFORE INSERT OR UPDATE ON training_sections
          FOR EACH ROW
          EXECUTE FUNCTION check_section_level();
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✓ Level enforcement trigger created');

    // Create update trigger for updated_at
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TRIGGER update_training_sections_updated_at BEFORE UPDATE
          ON training_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TRIGGER update_training_resources_updated_at BEFORE UPDATE
          ON training_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✓ Updated_at triggers created');

    console.log('\n✅ Training system tables created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTrainingTables().catch(console.error);