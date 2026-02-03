import { Command } from 'commander';
import { devCommand } from './commands/dev';
import { seedCommand } from './commands/seed';

import { syncCommand } from './commands/sync';

const program = new Command();

program
    .name('authkit')
    .description('AuthKit CLI for local development')
    .version('0.0.1');

program.addCommand(devCommand);
program.addCommand(seedCommand);
program.addCommand(syncCommand);

program.parse(process.argv);
