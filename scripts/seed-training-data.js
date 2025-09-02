const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedTrainingData() {
  try {
    console.log('Seeding training data...');

    // Create main sections
    const nationalLife = await prisma.trainingSection.create({
      data: {
        name: 'National Life',
        description: 'Productos y entrenamientos de National Life',
        level: 0,
        order: 1,
        isActive: true
      }
    });

    const allianz = await prisma.trainingSection.create({
      data: {
        name: 'Allianz',
        description: 'Productos y entrenamientos de Allianz',
        level: 0,
        order: 2,
        isActive: true
      }
    });

    // Create subsections for National Life
    const iul = await prisma.trainingSection.create({
      data: {
        parentId: nationalLife.id,
        name: 'IUL (Indexed Universal Life)',
        description: 'Seguro de vida universal indexado',
        level: 1,
        order: 1,
        isActive: true
      }
    });

    const termLife = await prisma.trainingSection.create({
      data: {
        parentId: nationalLife.id,
        name: 'Seguro de Vida Término',
        description: 'Seguros de vida a término fijo',
        level: 1,
        order: 2,
        isActive: true
      }
    });

    // Create sub-subsection for IUL
    const iulDocs = await prisma.trainingSection.create({
      data: {
        parentId: iul.id,
        name: 'Documentos Importantes',
        description: 'Documentación esencial para IUL',
        level: 2,
        order: 1,
        isActive: true
      }
    });

    // Add resources to IUL section
    await prisma.trainingResource.create({
      data: {
        sectionId: iul.id,
        title: 'Introducción a IUL',
        description: 'Video explicativo sobre los conceptos básicos de IUL',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        resourceType: 'VIDEO',
        duration: '15:30',
        order: 1,
        isActive: true
      }
    });

    await prisma.trainingResource.create({
      data: {
        sectionId: iul.id,
        title: 'Guía de Ventas IUL 2024',
        description: 'Manual completo para vender productos IUL',
        url: 'https://drive.google.com/file/d/1234567890abcdef/preview',
        resourceType: 'PDF',
        order: 2,
        isActive: true
      }
    });

    // Add resources to IUL Documents subsection
    await prisma.trainingResource.create({
      data: {
        sectionId: iulDocs.id,
        title: 'Contrato Ejemplo IUL',
        description: 'Ejemplo de contrato completo para referencia',
        url: 'https://drive.google.com/file/d/abcdef1234567890/preview',
        resourceType: 'PDF',
        order: 1,
        isActive: true
      }
    });

    await prisma.trainingResource.create({
      data: {
        sectionId: iulDocs.id,
        title: 'Calculadora de Beneficios',
        description: 'Herramienta para calcular beneficios IUL',
        url: 'https://vimeo.com/123456789',
        resourceType: 'VIDEO',
        duration: '8:45',
        order: 2,
        isActive: true
      }
    });

    // Add a third level subsection to test depth limit
    const casosEstudio = await prisma.trainingSection.create({
      data: {
        parentId: iulDocs.id,
        name: 'Casos de Estudio',
        description: 'Ejemplos prácticos de aplicación',
        level: 3,
        order: 1,
        isActive: true
      }
    });

    await prisma.trainingResource.create({
      data: {
        sectionId: casosEstudio.id,
        title: 'Caso: Familia Joven',
        description: 'Estrategia IUL para familia con hijos pequeños',
        url: 'https://drive.google.com/file/d/xyz789/preview',
        resourceType: 'PDF',
        order: 1,
        isActive: true
      }
    });

    console.log('✅ Training data seeded successfully!');
    
    // Display the structure
    console.log('\n📚 Training Structure Created:');
    console.log('National Life');
    console.log('  └── IUL');
    console.log('      ├── 📹 Introducción a IUL');
    console.log('      ├── 📄 Guía de Ventas IUL 2024');
    console.log('      └── Documentos Importantes');
    console.log('          ├── 📄 Contrato Ejemplo IUL');
    console.log('          ├── 📹 Calculadora de Beneficios');
    console.log('          └── Casos de Estudio');
    console.log('              └── 📄 Caso: Familia Joven');
    console.log('Allianz');

  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedTrainingData().catch(console.error);