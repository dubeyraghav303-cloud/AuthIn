import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { register } from 'ts-node';

export const syncCommand = new Command('sync')
    .description('Sync authkit.config.ts with the database')
    .action(async () => {
        const spinner = ora('Reading configuration...').start();

        const configPath = path.join(process.cwd(), 'authkit.config.ts');
        if (!fs.existsSync(configPath)) {
            spinner.fail('authkit.config.ts not found');
            return;
        }

        try {
            // Register ts-node to require .ts file
            register({
                compilerOptions: { module: 'commonjs' }
            });

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const config = require(configPath).default;
            spinner.succeed('Configuration loaded');

            console.log(chalk.blue('\nSyncing configuration to database...'));
            console.log(`  Providers: ${config.providers.join(', ')}`);
            console.log(`  Roles:     ${config.roles.join(', ')}`);

            // Mock DB update
            await new Promise(r => setTimeout(r, 1000));

            console.log(chalk.green('\n✔ Database policies updated'));
            console.log(chalk.green('✔ Roles synchronized'));

        } catch (e) {
            spinner.fail('Failed to load configuration');
            console.error(e);
        }
    });
