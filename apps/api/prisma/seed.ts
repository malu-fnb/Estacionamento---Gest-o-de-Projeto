import { AccessType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.parkingRecord.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.gatekeeper.deleteMany();
    await prisma.employee.deleteMany();

    const gatekeeper = await prisma.gatekeeper.create({
        data: {
            name: 'Carlos Porteiro',
            phone: '81999990000',
            email: 'carlos.porteiro@campusgate.local',
            cpf: '00011122233',
            password: '123456',
        },
    });

    const employeeAntonio = await prisma.employee.create({
        data: {
            name: 'Antônio Edson',
            department: 'Tecnologia da Informação',
            ra: 'RA001',
            email: 'antonio@email.com',
            phone: '81988887777',
        },
    });

    const employeeMalu = await prisma.employee.create({
        data: {
            name: 'Malu de Faria',
            department: 'Administração',
            ra: 'RA002',
            email: 'malu@email.com',
            phone: '81977776666',
        },
    });

    const employeeDavid = await prisma.employee.create({
        data: {
            name: 'David Cândido',
            department: 'Engenharia',
            ra: 'RA003',
            email: 'david@email.com',
            phone: '81966665555',
        },
    });

    const vehicleAntonio = await prisma.vehicle.create({
        data: {
            employeeId: employeeAntonio.id,
            plate: 'ABC1234',
            make: 'Toyota',
            model: 'Corolla',
            color: 'Prata',
        },
    });

    const vehicleMalu = await prisma.vehicle.create({
        data: {
            employeeId: employeeMalu.id,
            plate: 'XYZ9876',
            make: 'Chevrolet',
            model: 'Onix',
            color: 'Branco',
        },
    });

    const vehicleDavid = await prisma.vehicle.create({
        data: {
            employeeId: employeeDavid.id,
            plate: 'DEF2026',
            make: 'Honda',
            model: 'Civic',
            color: 'Preto',
        },
    });

    await prisma.parkingRecord.create({
        data: {
            vehicleId: vehicleAntonio.id,
            gatekeeperId: gatekeeper.id,
            type: AccessType.ENTRY,
            notes: 'Entrada autorizada.',
        },
    });

    await prisma.parkingRecord.create({
        data: {
            vehicleId: vehicleMalu.id,
            gatekeeperId: gatekeeper.id,
            type: AccessType.ENTRY,
            notes: 'Veículo com pequeno arranhão na porta.',
        },
    });

    await prisma.parkingRecord.create({
        data: {
            vehicleId: vehicleMalu.id,
            gatekeeperId: gatekeeper.id,
            type: AccessType.EXIT,
            notes: 'Saída registrada normalmente.',
        },
    });

    await prisma.parkingRecord.create({
        data: {
            vehicleId: vehicleDavid.id,
            gatekeeperId: gatekeeper.id,
            type: AccessType.ENTRY,
            notes: 'Entrada sem observações.',
        },
    });

    console.log('Seed executado com sucesso.');
}

main()
    .catch((error) => {
        console.error('Erro ao executar seed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });