import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create employee user
  const employeePassword = await bcrypt.hash('employee123', 10);
  const employee = await prisma.user.upsert({
    where: { email: 'employee@demo.com' },
    update: {},
    create: {
      email: 'employee@demo.com',
      password: employeePassword,
      name: 'Employee User',
      role: 'EMPLOYEE',
    },
  });
  console.log('✅ Created employee user:', employee.email);

  // Create a sample project for admin
  const project = await prisma.project.create({
    data: {
      name: 'Sample Project',
      description: 'A sample project to demonstrate the system',
      billingRate: 100,
      status: 'ACTIVE',
      userId: admin.id,
    },
  });
  console.log('✅ Created sample project:', project.name);

  // Create sample time logs
  await prisma.timeLog.createMany({
    data: [
      {
        hours: 4,
        notes: 'Initial setup and planning',
        logDate: new Date(),
        status: 'DONE',
        projectId: project.id,
        userId: admin.id,
      },
      {
        hours: 2,
        notes: 'Development work',
        logDate: new Date(),
        status: 'IN_PROGRESS',
        projectId: project.id,
        userId: employee.id,
      },
      {
        hours: 3,
        notes: 'Testing',
        logDate: new Date(),
        status: 'TODO',
        projectId: project.id,
        userId: employee.id,
      },
    ],
  });
  console.log('✅ Created sample time logs');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Demo Accounts:');
  console.log('   Admin: admin@demo.com / admin123');
  console.log('   Employee: employee@demo.com / employee123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
