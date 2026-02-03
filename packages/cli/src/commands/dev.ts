import { Command } from 'commander';
import execa from 'execa';
import ora from 'ora';
import chalk from 'chalk';

export const devCommand = new Command('dev')
    .description('Start the local development environment')
    .action(async () => {
        console.log(chalk.bold.blue('\n🚀 Starting AuthKit Local Dev Environment...\n'));

        const spinner = ora('Checking Docker...').start();

        try {
            await execa('docker', ['info']);
            spinner.succeed('Docker is running');
        } catch (e) {
            spinner.fail('Docker is not running. Please start Docker Desktop and try again.');
            process.exit(1);
        }

        const infraSpinner = ora('Starting Infrastructure (Postgres, Redis)...').start();
        try {
            // Run docker-compose up -d in the root
            // Assuming we assume the CLI is run from root or we find root
            await execa('docker-compose', ['up', '-d'], { stdio: 'ignore' });
            infraSpinner.succeed('Infrastructure ready');
        } catch (e) {
            infraSpinner.fail('Failed to start infrastructure');
            console.error(e);
            process.exit(1);
        }

        console.log(chalk.gray('\nStarting services...'));
        console.log(chalk.green('  ➜ API:     http://localhost:3000'));
        console.log(chalk.green('  ➜ Web:     http://localhost:3001'));
        console.log(chalk.green('  ➜ Landing: http://localhost:3002'));
        console.log(chalk.gray('\nPress Ctrl+C to stop.\n'));

        // Run pnpm dev in root
        // We use stdio: inherit to let the output flow through
        try {
            await execa('pnpm', ['dev'], { stdio: 'inherit' });
        } catch (e) {
            // pnpm dev was killed
        }
    });
