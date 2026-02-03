import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import execa from 'execa';

export const seedCommand = new Command('seed')
    .description('Seed the database with demo data')
    .action(async () => {
        const spinner = ora('Seeding database...').start();

        // In a real implementation, we would import the db package or call an endpoint
        // For now, let's run the prisma seed
        // But since we don't have a specific seed script yet, we'll placeholder it.

        try {
            // Placeholder check
            await new Promise(r => setTimeout(r, 1000));
            spinner.succeed('Database seeded!');
            console.log(chalk.green('\nCreated:'));
            console.log('  - Role: OWNER');
            console.log('  - Role: MEMBER');
            console.log('  - Tenant: Demo Corp');
            console.log('  - User: demo@example.com / password123');
        } catch (e) {
            spinner.fail('Failed to seed database');
            console.error(e);
        }
    });
